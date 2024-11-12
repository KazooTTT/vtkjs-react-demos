import { createContext, ReactNode, useContext } from "react";
import PerformanceMonitor from "../components/PerformanceMonitor";

const PerformanceContext = createContext<{ showMonitor: boolean }>({
  showMonitor: true,
});

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  return (
    <PerformanceContext.Provider value={{ showMonitor: true }}>
      {children}
      <PerformanceMonitor />
    </PerformanceContext.Provider>
  );
}

export const usePerformance = () => useContext(PerformanceContext);
