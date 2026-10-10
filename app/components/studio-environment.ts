import {
  CubeUVReflectionMapping,
  DataTexture,
  FileLoader,
  HalfFloatType,
  LinearFilter,
  LinearSRGBColorSpace,
  Loader,
  REVISION,
  RGBAFormat,
} from "three";

export const STUDIO_ENVIRONMENT_URL = "/studio/studio-environment-r186.bin.gz";

type EnvironmentPixels = { width: number; height: number; data: Uint16Array };

// Cache CPU pixels through useLoader; each canvas owns its GPU texture.
export class StudioEnvironmentLoader extends Loader<EnvironmentPixels> {
  load(
    url: string,
    onLoad: (pixels: EnvironmentPixels) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void,
  ) {
    new FileLoader(this.manager).setResponseType("arraybuffer").load(
      url,
      (compressed) => {
        const decode = async () => {
          if (!(compressed instanceof ArrayBuffer))
            throw new Error("Invalid studio environment response");
          const stream = new Blob([compressed])
            .stream()
            .pipeThrough(new DecompressionStream("gzip"));
          const buffer = await new Response(stream).arrayBuffer();
          if (buffer.byteLength < 16)
            throw new Error("Invalid studio environment header");
          const header = new DataView(buffer);
          const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
          const revision = header.getUint32(4, true);
          const width = header.getUint32(8, true);
          const height = header.getUint32(12, true);
          if (
            magic !== "TPMG" ||
            revision !== Number(REVISION) ||
            width !== 768 ||
            height !== 1024 ||
            buffer.byteLength !== 16 + width * height * 4 * 2
          )
            throw new Error("Incompatible studio environment asset");
          // Lossless spatial and RGB prediction shrinks the original atlas.
          // Reconstruct channel planes before interleaving its half-float bits.
          const planes = new Uint16Array(buffer, 16);
          const count = width * height;
          for (let channel = 0; channel < 4; channel++) {
            const offset = channel * count;
            for (let i = 0; i < count; i++) {
              const column = i % width;
              const left = column ? planes[offset + i - 1] : 0;
              const above = i >= width ? planes[offset + i - width] : 0;
              const upperLeft =
                column && i >= width ? planes[offset + i - width - 1] : 0;
              planes[offset + i] += left + above - upperLeft;
            }
          }
          const data = new Uint16Array(count * 4);
          for (let i = 0; i < count; i++) {
            const red = planes[i];
            data[i * 4] = red;
            data[i * 4 + 1] = red + planes[count + i];
            data[i * 4 + 2] = red + planes[count * 2 + i];
            data[i * 4 + 3] = planes[count * 3 + i];
          }
          return { width, height, data };
        };
        void decode().then(onLoad, onError);
      },
      onProgress,
      onError,
    );
  }
}

export function createStudioEnvironment(pixels: EnvironmentPixels) {
  const texture = new DataTexture(
    pixels.data,
    pixels.width,
    pixels.height,
    RGBAFormat,
    HalfFloatType,
  );
  texture.mapping = CubeUVReflectionMapping;
  texture.colorSpace = LinearSRGBColorSpace;
  texture.minFilter = texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
}
