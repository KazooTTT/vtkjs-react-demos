import vtkConeSource from "@kitware/vtk.js/Filters/Sources/ConeSource";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import { useEffect, useRef, useState } from "react";

// Define the type for context
type VtkContext = {
  fullScreenRenderer: vtkFullScreenRenderWindow;
  renderWindow: vtkRenderWindow;
  renderer: vtkRenderer;
  coneSource: vtkConeSource;
  actor: vtkActor;
  mapper: vtkMapper;
} | null;

function App() {
  const vtkContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<VtkContext>(null);
  const [coneResolution, setConeResolution] = useState(6);
  const [representation, setRepresentation] = useState(2);

  useEffect(() => {
    // Initialize, check if context is null and target element exists
    if (!context.current && vtkContainerRef.current) {
      // Create a full-screen render window
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        container: vtkContainerRef.current,
      });

      // Create a cone source
      const coneSource = vtkConeSource.newInstance({ height: 1.0 });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(coneSource.getOutputPort());

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        fullScreenRenderer,
        renderWindow,
        renderer,
        coneSource,
        actor,
        mapper,
      };
    }

    return () => {
      if (context.current) {
        const { fullScreenRenderer, coneSource, actor, mapper } =
          context.current;
        actor.delete();
        mapper.delete();
        coneSource.delete();
        fullScreenRenderer.delete();
        context.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (context.current) {
      // Listen for changes in resolution and update coneSource's resolution
      const { coneSource, renderWindow } = context.current;
      coneSource.setResolution(coneResolution);
      // Re-render
      renderWindow.render();
    }
  }, [coneResolution]);

  useEffect(() => {
    if (context.current) {
      const { actor, renderWindow } = context.current;
      actor.getProperty().setRepresentation(representation);
      renderWindow.render();
    }
  }, [representation]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div ref={vtkContainerRef} className="w-full h-full" />
      <table className="absolute top-[25px] left-[25px] bg-white p-[12px] rounded">
        <tbody>
          <tr>
            <td>
              <select
                value={representation}
                className="w-full p-[4px]"
                onChange={(ev) => setRepresentation(Number(ev.target.value))}
              >
                <option value="0">Points</option>
                <option value="1">Wireframe</option>
                <option value="2">Surface</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="range"
                min="4"
                max="80"
                value={coneResolution}
                onChange={(ev) => setConeResolution(Number(ev.target.value))}
                className="w-full"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
