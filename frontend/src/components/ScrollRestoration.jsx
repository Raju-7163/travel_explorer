import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (sectionId) {
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    if (location.hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    if (navigationType === "POP") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.hash, location.key, location.pathname, location.state, navigationType]);

  return null;
}
