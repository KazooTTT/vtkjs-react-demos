import { CSSProperties, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
    }
  };

  const pageStyle: CSSProperties = {
    opacity: transitionStage === "fadeIn" ? 1 : 0,
    transition: "opacity 0.3s ease-in-out",
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
        }}
      >
        <div style={pageStyle} onTransitionEnd={handleAnimationEnd}>
          <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
