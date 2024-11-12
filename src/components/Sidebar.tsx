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
        <div style={{ padding: "16px 0" }}>{routes.map(renderMenuItem)}</div>
      )}
    </div>
  );
}

export default Sidebar;
