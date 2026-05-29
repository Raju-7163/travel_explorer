import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useSmartBack(fallback = "/") {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.state?.from) {
      navigate(location.state.from);
      return;
    }

    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate(fallback, { replace: false });
  }, [fallback, location.key, location.state, navigate]);
}
