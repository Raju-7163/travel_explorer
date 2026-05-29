import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useHomeSectionNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (sectionId = "") => {
      const scrollTo = sectionId || undefined;
      const isAlreadyHome = location.pathname === "/";

      if (isAlreadyHome && location.state?.scrollTo === scrollTo) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      navigate(
        "/",
        isAlreadyHome
          ? { state: { scrollTo }, replace: false }
          : { state: { scrollTo, from: location } }
      );
    },
    [location, navigate]
  );
}
