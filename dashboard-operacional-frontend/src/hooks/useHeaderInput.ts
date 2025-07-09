import { useOutletContext } from "react-router-dom";

type ContextType = {
  headerInputValue: string;
  setHeaderInputValue: (value: string) => void;
};

export function useHeaderInput() {
  return useOutletContext<ContextType>();
}
