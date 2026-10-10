// Admit the decorative scene before downloading Three or constructing a renderer.
// Software WebGL can technically work while freezing the page during startup.
export function canRenderHero() {
  const canvas = document.createElement("canvas");
  let context: WebGL2RenderingContext | null = null;
  try {
    context = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
      powerPreference: "high-performance",
    });
    if (!context) return false;
    const info = context.getExtension("WEBGL_debug_renderer_info");
    const renderer = info
      ? String(context.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";
    return !/swiftshader|llvmpipe|softpipe|software rasterizer|lavapipe/i.test(
      renderer,
    );
  } catch {
    return false;
  } finally {
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
