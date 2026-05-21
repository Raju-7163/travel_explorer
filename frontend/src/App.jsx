import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: "text-sm font-semibold",
          success: {
            iconTheme: {
              primary: "#155e3b",
              secondary: "#ffffff"
            }
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff"
            }
          }
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}
