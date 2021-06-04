import { createContext, useContext } from "react";
export const FindState = createContext();

export function useFindState() {
  return useContext(FindState);
}