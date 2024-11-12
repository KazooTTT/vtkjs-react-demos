import vtkSphereSource from "@kitware/vtk.js/Filters/Sources/SphereSource";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import { useEffect, useRef, useState } from "react";

type VtkContext = {
  fullScreenRenderer: vtkGenericRenderWindow;
  renderWindow: vtkRenderWindow;
  renderer: vtkRenderer;
  sphereActor: vtkActor;
} | null;

type TimeoutHandle = ReturnType<typeof setTimeout>;

function BlinkPage() {
  const vtkContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<VtkContext>(null);
  const timerRef = useRef<TimeoutHandle>();
  const [isBlinking, setIsBlinking] = useState(false);
  const BLINK_INTERVAL = 500; // 闪烁间隔时间（毫秒）

  useEffect(() => {
    if (!context.current && vtkContainerRef.current) {
      const genericRenderer = vtkGenericRenderWindow.newInstance();
      const container = vtkContainerRef.current;

      genericRenderer.setContainer(container);
      genericRenderer.resize();

      const renderer = genericRenderer.getRenderer();
      const renderWindow = genericRenderer.getRenderWindow();

      renderer.setBackground(0.1, 0.1, 0.1);

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

      const resizeObserver = new ResizeObserver(() => {
        if (container) {
          genericRenderer.resize();
          renderWindow.render();
        }
      });

      resizeObserver.observe(container);

      return () => {
        if (context.current) {
          const { fullScreenRenderer } = context.current;
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          resizeObserver.disconnect();
          fullScreenRenderer.delete();
          context.current = null;
        }
      };
    }
  }, []);

  // 使用 setInterval 控制闪烁
  useEffect(() => {
    if (isBlinking && context.current) {
      timerRef.current = setInterval(() => {
        const { sphereActor, renderWindow } = context.current!;
        const currentColor = sphereActor.getProperty().getColor();
        const newColor: [number, number, number] =
          currentColor[0] === 1.0 && currentColor[1] === 0.0
            ? [1.0, 1.0, 0.0] // 黄色
            : [1.0, 0.0, 0.0]; // 红色

        sphereActor
          .getProperty()
          .setColor(newColor[0], newColor[1], newColor[2]);
        renderWindow.render();
      }, BLINK_INTERVAL);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // 停止时将球体设置为红色
      if (context.current) {
        const { sphereActor, renderWindow } = context.current;
        sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // 红色
        renderWindow.render();
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isBlinking]);

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
