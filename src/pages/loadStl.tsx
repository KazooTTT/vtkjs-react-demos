import vtkSTLReader from "@kitware/vtk.js/IO/Geometry/STLReader";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import { useEffect, useRef } from "react";

function LoadStl() {
  const vtkContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<{
    fullScreenRenderer: vtkGenericRenderWindow;
    renderWindow: vtkRenderWindow;
    renderer: vtkRenderer;
  } | null>(null);

  useEffect(() => {
    if (!context.current && vtkContainerRef.current) {
      // 初始化 VTK 渲染器
      const genericRenderer = vtkGenericRenderWindow.newInstance();
      const container = vtkContainerRef.current;
      genericRenderer.setContainer(container);
      genericRenderer.resize();

      const renderer = genericRenderer.getRenderer();
      const renderWindow = genericRenderer.getRenderWindow();
      renderer.setBackground(0.1, 0.1, 0.1);

      // 创建 actor 和 mapper
      const mapper = vtkMapper.newInstance();
      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);
      renderer.addActor(actor);

      context.current = {
        fullScreenRenderer: genericRenderer,
        renderWindow,
        renderer,
      };

      // 加载 STL 文件
      const reader = vtkSTLReader.newInstance();
      fetch("src/assets/stlModels/sphere.stl")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          reader.parseAsArrayBuffer(arrayBuffer);
          mapper.setInputData(reader.getOutputData());
          renderer.resetCamera();
          renderWindow.render();
        })
        .catch((error) => {
          console.error("Error loading STL:", error);
        });

      // 处理窗口大小变化
      const resizeObserver = new ResizeObserver(() => {
        if (container) {
          genericRenderer.resize();
          renderWindow.render();
        }
      });
      resizeObserver.observe(container);

      // 清理函数
      return () => {
        resizeObserver.disconnect();
        genericRenderer.delete();
        context.current = null;
      };
    }
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div ref={vtkContainerRef} className="w-full h-full" />
    </div>
  );
}

export default LoadStl;
