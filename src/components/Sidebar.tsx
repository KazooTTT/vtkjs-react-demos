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
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: isActive ? "#e6f7ff" : "transparent",
          color: isActive ? "#1890ff" : "#000",
          transition: "all 0.3s",
        }}
      >
        {route.path}
      </div>
    );
  };

  return (
    <div
      style={{
        width: isCollapsed ? "50px" : "200px",
        height: "100%",
        backgroundColor: "#fff",
        borderRight: "1px solid #f0f0f0",
        transition: "width 0.3s",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: "absolute",
          right: "-12px",
          top: "20px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          border: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        {isCollapsed ? ">" : "<"}
      </button>

      {!isCollapsed && (
        <>
          <div style={{ padding: "16px 0", flex: 1 }}>
            {routes.map(renderMenuItem)}
          </div>

          <a
            href="https://github.com/KazooTTT/vtkjs-react-demos"
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 border-t border-gray-200 flex items-center  justify-center text-black no-underline"
          >
            <svg
              height="24"
              width="24"
              viewBox="0 0 16 16"
              style={{ marginRight: "8px" }}
            >
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
