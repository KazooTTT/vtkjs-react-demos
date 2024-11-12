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
  const BLINK_INTERVAL = 500; // Blink interval time (milliseconds)

  useEffect(() => {
    if (!context.current && vtkContainerRef.current) {
      const genericRenderer = vtkGenericRenderWindow.newInstance();
      const container = vtkContainerRef.current;

      // Initialize genericRenderer
      genericRenderer.setContainer(container);
      genericRenderer.resize();

      const renderer = genericRenderer.getRenderer();
      const renderWindow = genericRenderer.getRenderWindow();

      // Set background color
      renderer.setBackground(0.1, 0.1, 0.1);

      // Create sphere
      const sphereSource = vtkSphereSource.newInstance({
        radius: 0.5,
        thetaResolution: 36,
        phiResolution: 18,
      });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(sphereSource.getOutputPort());

      const sphereActor = vtkActor.newInstance();
      sphereActor.setMapper(mapper);
      sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // Red

      renderer.addActor(sphereActor);
      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        fullScreenRenderer: genericRenderer,
        renderWindow,
        renderer,
        sphereActor,
      };

      // Add window resize observer
      const resizeObserver = new ResizeObserver(() => {
        if (container) {
          genericRenderer.resize();
          renderWindow.render();
        }
      });

      resizeObserver.observe(container);

      // Cleanup function to remove resizeObserver
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

  // Modify blink animation function
  const animate = useCallback(
    (timestamp: number) => {
      if (!context.current) return;

      if (!lastToggleTime.current) {
        lastToggleTime.current = timestamp;
      }

      const elapsed = timestamp - lastToggleTime.current;

      if (elapsed >= BLINK_INTERVAL) {
        const { sphereActor, renderWindow } = context.current;
        // Get current color
        const currentColor = sphereActor.getProperty().getColor();
        // Toggle between red and yellow
        const newColor: [number, number, number] =
          currentColor[0] === 1.0 && currentColor[1] === 0.0
            ? [1.0, 1.0, 0.0] // Yellow
            : [1.0, 0.0, 0.0]; // Red

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

  // Modify handling when stopping blinking
  useEffect(() => {
    if (isBlinking) {
      lastToggleTime.current = 0;
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Set sphere color to red when stopped
      if (context.current) {
        const { sphereActor, renderWindow } = context.current;
        sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // Red
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
        {isBlinking ? "stop" : "start"}
      </button>
    </div>
  );
}

export default BlinkPage;
