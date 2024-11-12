import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { PerformanceProvider } from "./contexts/PerformanceContext";
import "./index.css";
import MainLayout from "./layouts/MainLayout";

function App() {
  const routeElements = useRoutes(routes);
  return (
    <PerformanceProvider>
      <MainLayout>{routeElements}</MainLayout>
    </PerformanceProvider>
  );
}

const app = createRoot(document.getElementById("root")!);

app.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
