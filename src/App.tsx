import { useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { PerformanceProvider } from "./contexts/PerformanceContext";
import MainLayout from "./layouts/MainLayout";

function App() {
  const routeElements = useRoutes(routes);
  return (
    <PerformanceProvider>
      <MainLayout>{routeElements}</MainLayout>
    </PerformanceProvider>
  );
}

export default App;
