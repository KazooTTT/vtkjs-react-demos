import vtkPolyData from "@kitware/vtk.js/Common/DataModel/PolyData";
import vtkSTLWriter from "@kitware/vtk.js/IO/Geometry/STLWriter";
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
    actor: vtkActor;
    mapper: vtkMapper;
  } | null>(null);

  useEffect(() => {
    if (!context.current && vtkContainerRef.current) {
      const genericRenderer = vtkGenericRenderWindow.newInstance();
      const container = vtkContainerRef.current;
      genericRenderer.setContainer(container);
      genericRenderer.resize();

      const renderer = genericRenderer.getRenderer();
      const renderWindow = genericRenderer.getRenderWindow();
      renderer.setBackground(0.1, 0.1, 0.1);

      const mapper = vtkMapper.newInstance();
      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);
      renderer.addActor(actor);

      context.current = {
        fullScreenRenderer: genericRenderer,
        renderWindow,
        renderer,
        actor,
        mapper,
      };

      const resizeObserver = new ResizeObserver(() => {
        if (container) {
          genericRenderer.resize();
          renderWindow.render();
        }
      });
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
        genericRenderer.delete();
        context.current = null;
      };
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !context.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const polyData = vtkPolyData.newInstance(jsonData);

        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance();
        mapper.setInputData(polyData);
        actor.setMapper(mapper);

        context.current?.mapper.setInputData(polyData);
        context.current?.renderer.resetCamera();
        context.current?.renderWindow.render();
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSTL = () => {
    if (!context.current?.mapper.getInputData()) {
      alert("Please load a JSON file first");
      return;
    }
    const polyData = context.current.mapper.getInputData();
    const writer = vtkSTLWriter.newInstance();
    writer.setInputData(polyData);
    const fileContents = writer.getOutputData();

    const blob = new Blob([fileContents], { type: "application/octet-stream" });
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "model.stl";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="p-4 space-x-4">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="mb-2"
        />
        <button
          onClick={handleDownloadSTL}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download STL
        </button>
      </div>
      <div ref={vtkContainerRef} className="w-full h-full" />
    </div>
  );
}

export default LoadStl;
