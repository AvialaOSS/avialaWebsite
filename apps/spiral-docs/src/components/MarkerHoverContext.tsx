import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MarkerHoverContextValue = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const MarkerHoverContext = createContext<MarkerHoverContextValue | null>(null);

export function MarkerHoverProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id);
  }, []);
  const value = useMemo(
    () => ({ activeId, setActiveId }),
    [activeId, setActiveId],
  );
  return (
    <MarkerHoverContext.Provider value={value}>
      {children}
    </MarkerHoverContext.Provider>
  );
}

export function useMarkerHover() {
  return useContext(MarkerHoverContext);
}
