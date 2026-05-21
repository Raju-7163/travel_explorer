import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useHomeSectionNavigation() {
  const navigate = useNavigate();

  return useCallback(
    (sectionId = "") => {
      const hash = sectionId ? `#${sectionId}` : "";

      navigate({
        pathname: "/",
        hash
      });
    },
    [navigate]
  );
}
