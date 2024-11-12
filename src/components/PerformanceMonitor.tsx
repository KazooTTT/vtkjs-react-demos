import { useEffect, useRef, useState } from "react";

interface PerformanceStats {
  fps: number;
  frameTime: number;
  cpuUsage: number;
  gpuInfo?: {
    vendor: string;
    renderer: string;
  };
  canvasCount: number;
}

function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    cpuUsage: 0,
    canvasCount: 0,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lastFpsUpdate = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const updateStats = () => {
      const now = performance.now();
      frameCount.current++;

      if (now - lastFpsUpdate.current >= 1000) {
        const fps = Math.round(
          (frameCount.current * 1000) / (now - lastFpsUpdate.current)
        );
        const frameTime = now - lastTime.current;

        const canvases = document.querySelectorAll("canvas");
        const canvasCount = canvases.length;

        let gpuInfo: PerformanceStats["gpuInfo"] = undefined;
        for (const canvas of canvases) {
          const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
          if (gl) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
              gpuInfo = {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
              };
              break;
            }
          }
        }

        setStats((prev) => ({
          ...prev,
          fps,
          frameTime,
          cpuUsage: performance.now() - now,
          gpuInfo,
          canvasCount,
        }));

        frameCount.current = 0;
        lastFpsUpdate.current = now;
      }

      lastTime.current = now;
      animationFrameId = requestAnimationFrame(updateStats);
    };

    animationFrameId = requestAnimationFrame(updateStats);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed top-[25px] right-[25px] bg-black bg-opacity-70 p-[10px] rounded text-white font-mono text-[12px] z-[9999] cursor-pointer transition-all duration-300 ease-in-out max-h-[${
        isCollapsed ? "20px" : "200px"
      }] overflow-hidden`}
    >
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center mb-[8px] select-none"
      >
        <span className="mr-[5px]">{isCollapsed ? "▶" : "▼"}</span>
        <span>Performance Monitor</span>
      </div>
      {!isCollapsed && (
        <div className="pl-[15px]">
          <div>FPS: {stats.fps}</div>
          <div>Frame Time: {stats.frameTime.toFixed(2)} ms</div>
          <div>CPU Time: {stats.cpuUsage.toFixed(2)} ms</div>
          <div>Canvas Count: {stats.canvasCount}</div>
          {stats.gpuInfo && (
            <>
              <div>GPU: {stats.gpuInfo.vendor}</div>
              <div>Renderer: {stats.gpuInfo.renderer}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PerformanceMonitor;
