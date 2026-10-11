// Run from the repository with Windows Node and installed Microsoft Edge:
// node scripts/bake-studio-environment.mjs
//
// This is the original StudioPanel / PanelRadiance lighting, baked with the
// installed Three release. Visitors upload its cubeUV atlas without rebuilding
// the six-face capture, sigma blur, or GGX radiance filtering.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { gzipSync, gunzipSync } from "node:zlib";
import { chromium } from "@playwright/test";
import { format, resolveConfig } from "prettier";

const repository = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.join(repository, "public", "studio");
const settings = {
  threeRevision: 186,
  background: "#0c0e0d",
  size: 256,
  sigma: 0.09,
  near: 0.1,
  far: 100,
  capturePosition: [0, 3.3, 0],
  panels: [
    {
      position: [-7, 3, 0],
      target: [0, 3, 0],
      width: 18,
      height: 20,
      kind: 0,
    },
    {
      position: [7, 3, 0],
      target: [0, 3, 0],
      width: 18,
      height: 20,
      kind: 1,
    },
    {
      position: [0, 13, 0],
      target: [0, 3.3, 0],
      width: 14,
      height: 18,
      kind: 2,
    },
    {
      position: [0, 3, 9],
      target: [0, 3, 0],
      width: 14,
      height: 20,
      kind: 3,
    },
  ],
};

// Preserve every half-float bit. RGB channels are almost equal for these white
// panels, so encode R, G-R, B-R, A in separate planes. Each plane then stores
// its 2D gradient residual: current - (left + up - upperLeft), modulo 65536.
// Boundaries use zero; prediction always reads transformed source values.
function encodePixels(pixels, width, height) {
  const count = width * height;
  const planes = new Uint16Array(count * 4);
  for (let channel = 0; channel < 4; channel++) {
    for (let pixel = 0; pixel < count; pixel++) {
      const value = pixels.readUInt16LE(pixel * 8 + channel * 2);
      const red = pixels.readUInt16LE(pixel * 8);
      planes[channel * count + pixel] =
        channel === 1 || channel === 2 ? (value - red) & 0xffff : value;
    }
  }
  const encoded = Buffer.alloc(pixels.length);
  for (let channel = 0; channel < 4; channel++) {
    for (let pixel = 0; pixel < count; pixel++) {
      const index = channel * count + pixel;
      const x = pixel % width;
      const left = x ? planes[index - 1] : 0;
      const up = pixel >= width ? planes[index - width] : 0;
      const upperLeft = x && pixel >= width ? planes[index - width - 1] : 0;
      encoded.writeUInt16LE(
        (planes[index] - (left + up - upperLeft)) & 0xffff,
        index * 2,
      );
    }
  }
  return encoded;
}

function decodePixels(encoded, width, height) {
  const count = width * height;
  const planes = new Uint16Array(count * 4);
  for (let channel = 0; channel < 4; channel++) {
    for (let pixel = 0; pixel < count; pixel++) {
      const index = channel * count + pixel;
      const x = pixel % width;
      const left = x ? planes[index - 1] : 0;
      const up = pixel >= width ? planes[index - width] : 0;
      const upperLeft = x && pixel >= width ? planes[index - width - 1] : 0;
      planes[index] =
        (encoded.readUInt16LE(index * 2) + left + up - upperLeft) & 0xffff;
    }
  }
  const pixels = Buffer.alloc(encoded.length);
  for (let pixel = 0; pixel < count; pixel++) {
    const red = planes[pixel];
    pixels.writeUInt16LE(red, pixel * 8);
    pixels.writeUInt16LE((red + planes[count + pixel]) & 0xffff, pixel * 8 + 2);
    pixels.writeUInt16LE(
      (red + planes[count * 2 + pixel]) & 0xffff,
      pixel * 8 + 4,
    );
    pixels.writeUInt16LE(planes[count * 3 + pixel], pixel * 8 + 6);
  }
  return pixels;
}

async function main() {
  // Serve only the bake document and the two installed Three build modules.
  // Port 0 avoids colliding with an application's existing development server.
  const routes = new Map([
    [
      "/",
      {
        type: "text/html",
        body: "<!doctype html><title>Studio lighting bake</title>",
      },
    ],
    [
      "/three.module.js",
      {
        type: "text/javascript",
        body: await readFile(
          path.join(repository, "node_modules/three/build/three.module.js"),
        ),
      },
    ],
    [
      "/three.core.js",
      {
        type: "text/javascript",
        body: await readFile(
          path.join(repository, "node_modules/three/build/three.core.js"),
        ),
      },
    ],
  ]);
  const server = createServer((request, response) => {
    if (request.url === "/favicon.ico") {
      response.writeHead(204).end();
      return;
    }
    const route = routes.get(request.url);
    if (!route) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "Content-Type": route.type });
    response.end(route.body);
  });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    browser = await chromium.launch({
      channel: "msedge",
      headless: true,
      args: ["--enable-unsafe-swiftshader"],
    });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const result = await page.evaluate(async (settings) => {
      const THREE = await import("/three.module.js");
      if (Number(THREE.REVISION) !== settings.threeRevision)
        throw new Error(
          "Review the cubeUV asset format before upgrading Three.",
        );
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.72;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(settings.background);
      for (const panel of settings.panels) {
        const colors = new Float32Array(33 * 33 * 3);
        const smooth = (low, high, value) =>
          THREE.MathUtils.smoothstep(value, low, high);
        for (let row = 0; row <= 32; row++)
          for (let column = 0; column <= 32; column++) {
            const u = column / 32;
            const v = 1 - row / 32;
            const energy =
              panel.kind === 0
                ? 0.015 +
                  2.2 *
                    smooth(0.02, 0.22, u) *
                    (1 - smooth(0.78, 0.98, u)) *
                    (1 - smooth(0.18, 0.48, v))
                : panel.kind === 1
                  ? 0.005 +
                    5.5 *
                      smooth(0.58, 0.62, u) *
                      (1 - smooth(0.65, 0.69, u)) *
                      smooth(0.12, 0.45, v) *
                      (1 - smooth(0.8, 1, v))
                  : panel.kind === 2
                    ? 0.005 +
                      4.8 *
                        smooth(0.51, 0.56, u) *
                        (1 - smooth(0.62, 0.69, u)) *
                        smooth(0.02, 0.18, v) *
                        (1 - smooth(0.82, 0.98, v))
                    : 0.005 +
                      6.25 *
                        smooth(0.56, 0.63, v) *
                        (1 - smooth(0.7, 0.77, v)) *
                        (0.6 + 0.4 * smooth(0.3, 0.7, u));
            colors.fill(
              energy,
              (row * 33 + column) * 3,
              (row * 33 + column) * 3 + 3,
            );
          }
        const geometry = new THREE.PlaneGeometry(
          panel.width,
          panel.height,
          32,
          32,
        );
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const material = new THREE.MeshBasicMaterial({
          vertexColors: true,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...panel.position);
        mesh.lookAt(new THREE.Vector3(...panel.target));
        scene.add(mesh);
      }
      const generator = new THREE.PMREMGenerator(renderer);
      let target;
      try {
        target = generator.fromScene(
          scene,
          settings.sigma,
          settings.near,
          settings.far,
          {
            position: new THREE.Vector3(...settings.capturePosition),
            size: settings.size,
          },
        );
        if (
          target.texture.type !== THREE.HalfFloatType ||
          target.texture.format !== THREE.RGBAFormat ||
          target.texture.colorSpace !== THREE.LinearSRGBColorSpace ||
          target.texture.mapping !== THREE.CubeUVReflectionMapping
        )
          throw new Error("Unexpected PMREM output format.");
        const pixels = new Uint16Array(target.width * target.height * 4);
        await renderer.readRenderTargetPixelsAsync(
          target,
          0,
          0,
          target.width,
          target.height,
          pixels,
        );
        if (renderer.getContext().getError() !== 0)
          throw new Error("WebGL failed to export the half-float atlas.");
        let minimum = Infinity;
        let maximum = -Infinity;
        let nonzeroChannels = 0;
        for (let index = 0; index < pixels.length; index++) {
          const value = THREE.DataUtils.fromHalfFloat(pixels[index]);
          if (!Number.isFinite(value))
            throw new Error("Atlas contains a non-finite channel.");
          if (index % 4 === 3) continue;
          minimum = Math.min(minimum, value);
          maximum = Math.max(maximum, value);
          if (value > 0) nonzeroChannels++;
        }
        if (maximum <= 1 || nonzeroChannels === 0)
          throw new Error("Atlas did not preserve HDR panel radiance.");
        // Explicit little-endian output, independent of the browser's native
        // typed-array byte order. WebGL readback starts at the bottom row (y=0).
        const bytes = new Uint8Array(pixels.byteLength);
        const view = new DataView(bytes.buffer);
        for (let index = 0; index < pixels.length; index++)
          view.setUint16(index * 2, pixels[index], true);
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(reader.error);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(new Blob([bytes]));
        });
        return {
          width: target.width,
          height: target.height,
          base64,
          channelRange: { minimum, maximum, nonzeroChannels },
        };
      } finally {
        target?.dispose();
        generator.dispose();
        scene.traverse((object) => {
          object.geometry?.dispose();
          object.material?.dispose();
        });
        renderer.dispose();
        renderer.forceContextLoss();
      }
    }, settings);
    if (errors.length) throw new Error(errors.join("\n"));
    const header = Buffer.alloc(16);
    header.write("TPMG", 0, "ascii");
    header.writeUInt32LE(settings.threeRevision, 4);
    header.writeUInt32LE(result.width, 8);
    header.writeUInt32LE(result.height, 12);
    const pixels = Buffer.from(result.base64, "base64");
    if (pixels.length !== result.width * result.height * 4 * 2)
      throw new Error("Unexpected readback byte length.");
    const encoded = encodePixels(pixels, result.width, result.height);
    const raw = Buffer.concat([header, encoded]);
    const compressed = gzipSync(raw, { level: 9 });
    const inflated = gunzipSync(compressed);
    if (!inflated.equals(raw))
      throw new Error("Compressed atlas failed its lossless round-trip check.");
    if (
      !decodePixels(inflated.subarray(16), result.width, result.height).equals(
        pixels,
      )
    )
      throw new Error(
        "Gradient encoding failed its bit-exact round-trip check.",
      );
    const basename = `studio-environment-r${settings.threeRevision}`;
    const metadata = {
      generator: "scripts/bake-studio-environment.mjs",
      settings,
      atlas: {
        width: result.width,
        height: result.height,
        mapping: "CubeUVReflectionMapping",
        format: "RGBAFormat",
        type: "HalfFloatType",
        colorSpace: "LinearSRGBColorSpace",
        minFilter: "LinearFilter",
        magFilter: "LinearFilter",
        generateMipmaps: false,
        flipY: false,
        rowOrder: "bottom-to-top (WebGL readback y=0 first)",
        channels: "RGBA IEEE 754 binary16, little-endian",
      },
      binary: {
        file: `${basename}.bin.gz`,
        compression: "gzip, level 9",
        headerBytes: 16,
        header: "TPMG (4 ASCII bytes), uint32 LE revision, width, height",
        payload:
          "Channel-major uint16 LE planes: R, (G-R) mod65536, (B-R) mod65536, A. Each plane stores (value-left-up+upperLeft) mod65536; outside-row/column neighbors are zero. Decode planes first, then restore G/B with R. All operations use binary16 bits without quantization.",
        uncompressedBytes: raw.length,
        compressedBytes: compressed.length,
        sha256: createHash("sha256").update(compressed).digest("hex"),
        decodedPixelsSha256: createHash("sha256").update(pixels).digest("hex"),
      },
      channelRange: result.channelRange,
      browser: browser.version(),
    };
    await writeFile(
      path.join(outputDirectory, `${basename}.bin.gz`),
      compressed,
    );
    const metadataPath = path.join(outputDirectory, `${basename}.json`);
    await writeFile(
      metadataPath,
      await format(JSON.stringify(metadata), {
        ...(await resolveConfig(metadataPath)),
        filepath: metadataPath,
      }),
    );
    console.log(
      JSON.stringify(
        {
          file: path.join(outputDirectory, `${basename}.bin.gz`),
          width: result.width,
          height: result.height,
          uncompressedBytes: raw.length,
          compressedBytes: compressed.length,
          channelRange: result.channelRange,
          sha256: metadata.binary.sha256,
        },
        null,
        2,
      ),
    );
  } finally {
    try {
      await browser?.close();
    } finally {
      await new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
