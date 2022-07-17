import { useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";

const useSearchQuery = <T>() => {
  const location = useLocation() as Location & T;

  return new URLSearchParams(location.search);
};

export default useSearchQuery;
