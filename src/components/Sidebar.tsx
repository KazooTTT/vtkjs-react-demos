import { useState } from "react";
import { RouteObject, useLocation, useNavigate } from "react-router-dom";
import routes from "~react-pages";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const renderMenuItem = (route: RouteObject) => {
    const isActive = location.pathname === "/" + route.path;

    return (
      <div
        key={route.path}
        onClick={() => {
          if (route.path) {
            navigate(route.path);
          }
        }}
        className={`p-2 cursor-pointer ${
          isActive ? "bg-blue-100 text-blue-600" : "bg-transparent text-black"
        } transition-all duration-300`}
      >
        {route.path}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col ${
        isCollapsed ? "w-12" : "w-52"
      } h-full bg-white border-r border-gray-200 transition-width duration-300 relative`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-[-12px] top-5 w-6 h-6 rounded-full border border-gray-200 bg-white cursor-pointer z-10"
      >
        {isCollapsed ? ">" : "<"}
      </button>

      {!isCollapsed && (
        <>
          <div className="py-4 flex-1">{routes.map(renderMenuItem)}</div>

          <a
            href="https://github.com/KazooTTT/vtkjs-react-demos"
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 border-t border-gray-200 flex items-center justify-center text-black no-underline"
          >
            <svg height="24" width="24" viewBox="0 0 16 16" className="mr-2">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            {!isCollapsed && "GitHub"}
          </a>
        </>
      )}
    </div>
  );
}

export default Sidebar;
