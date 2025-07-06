
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import FAQ from "./pages/FAQ";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import './i18n'; // استيراد إعداد i18n

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/chat",
      element: <ProtectedRoute><Chat /></ProtectedRoute>,
    },
    {
      path: "/admin",
      element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
    },
    {
      path: "/faq",
      element: <FAQ />,
    },
    {
      path: "/settings",
      element: <ProtectedRoute><Settings /></ProtectedRoute>,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
