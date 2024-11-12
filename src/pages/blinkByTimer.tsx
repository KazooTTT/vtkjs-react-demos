import vtkSphereSource from "@kitware/vtk.js/Filters/Sources/SphereSource";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import { useCallback, useEffect, useRef, useState } from "react";

type VtkContext = {
  fullScreenRenderer: vtkGenericRenderWindow;
  renderWindow: vtkRenderWindow;
  renderer: vtkRenderer;
  sphereActor: vtkActor;
} | null;

function BlinkPage() {
  const vtkContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<VtkContext>(null);
  const animationFrameId = useRef<number>();
  const [isBlinking, setIsBlinking] = useState(false);
  const lastToggleTime = useRef<number>(0);
  const BLINK_INTERVAL = 500; // 闪烁间隔时间（毫秒）

  useEffect(() => {
    if (!context.current && vtkContainerRef.current) {
      const genericRenderer = vtkGenericRenderWindow.newInstance();
      const container = vtkContainerRef.current;

      // 初始化 genericRenderer
      genericRenderer.setContainer(container);
      genericRenderer.resize();

      const renderer = genericRenderer.getRenderer();
      const renderWindow = genericRenderer.getRenderWindow();

      // 设置背景色
      renderer.setBackground(0.1, 0.1, 0.1);

      // 创建球体
      const sphereSource = vtkSphereSource.newInstance({
        radius: 0.5,
        thetaResolution: 36,
        phiResolution: 18,
      });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(sphereSource.getOutputPort());

      const sphereActor = vtkActor.newInstance();
      sphereActor.setMapper(mapper);
      sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // 红色

      renderer.addActor(sphereActor);
      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        fullScreenRenderer: genericRenderer,
        renderWindow,
        renderer,
        sphereActor,
      };

      // 添加窗口大小变化的监听
      const resizeObserver = new ResizeObserver(() => {
        if (container) {
          genericRenderer.resize();
          renderWindow.render();
        }
      });

      resizeObserver.observe(container);

      // 清理函数中添加 resizeObserver 的清理
      return () => {
        if (context.current) {
          const { fullScreenRenderer } = context.current;
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
          }
          resizeObserver.disconnect();
          fullScreenRenderer.delete();
          context.current = null;
        }
      };
    }
  }, []);

  // 修改闪烁动画函数
  const animate = useCallback(
    (timestamp: number) => {
      if (!context.current) return;

      if (!lastToggleTime.current) {
        lastToggleTime.current = timestamp;
      }

      const elapsed = timestamp - lastToggleTime.current;

      if (elapsed >= BLINK_INTERVAL) {
        const { sphereActor, renderWindow } = context.current;
        // 获取当前颜色
        const currentColor = sphereActor.getProperty().getColor();
        // 在红色和黄色之间切换
        const newColor: [number, number, number] =
          currentColor[0] === 1.0 && currentColor[1] === 0.0
            ? [1.0, 1.0, 0.0] // 黄色
            : [1.0, 0.0, 0.0]; // 红色

        sphereActor
          .getProperty()
          .setColor(newColor[0], newColor[1], newColor[2]);
        renderWindow.render();
        lastToggleTime.current = timestamp;
      }

      if (isBlinking) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    },
    [isBlinking]
  );

  // 修改停止闪烁时的处理
  useEffect(() => {
    if (isBlinking) {
      lastToggleTime.current = 0;
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // 停止时将球体设置为红色
      if (context.current) {
        const { sphereActor, renderWindow } = context.current;
        sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // 红色
        renderWindow.render();
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate, isBlinking]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div ref={vtkContainerRef} className="w-full h-full" />
      <button
        onClick={() => setIsBlinking(!isBlinking)}
        className={`absolute top-[25px] left-[25px] py-[8px] px-[16px] ${
          isBlinking ? "bg-[#ff4d4f]" : "bg-[#52c41a]"
        } text-white border-none rounded cursor-pointer text-[16px]`}
      >
        {isBlinking ? "停止" : "开始"}
      </button>
    </div>
  );
}

export default BlinkPage;
