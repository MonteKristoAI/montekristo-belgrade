import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useMkAuth } from "@/lib/mk-onboarding/useAuth";
import { Layout } from "./components/Layout";
import OnboardingLogin from "./OnboardingLogin";
import Dashboard from "./Dashboard";
import Portfolio from "./Portfolio";
import ActivityAll from "./ActivityAll";
import ClientDetail from "./ClientDetail";
import NewClient from "./NewClient";

function ProtectedRoutes() {
  const { session, loading } = useMkAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
        <p className="font-inter text-sm text-[#5A6577]">Ucitavam sesiju…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/onboarding/login" replace state={{ from: location }} />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="activity" element={<ActivityAll />} />
        <Route path="new" element={<NewClient />} />
        <Route path=":slug" element={<ClientDetail />} />
      </Routes>
    </Layout>
  );
}

export default function OnboardingRoutes() {
  return (
    <Routes>
      <Route path="login" element={<OnboardingLogin />} />
      <Route path="*" element={<ProtectedRoutes />} />
    </Routes>
  );
}
