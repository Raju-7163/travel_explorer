import { Link, useLocation } from "react-router-dom";

export default function AppLink({ to, state, replace = false, children, ...props }) {
  const location = useLocation();

  return (
    <Link
      to={to}
      replace={replace}
      state={{ from: location, ...state }}
      {...props}
    >
      {children}
    </Link>
  );
}
