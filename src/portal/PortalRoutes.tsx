/**
 * MonteKristo Client Portal — entry point.
 *
 * Mounted from the parent app's router via:
 *   <Route path="/reports/portal/*" element={<PortalRoutes />} />
 *
 * The portal lives inside a single `.mk-portal` wrapper so its coral/navy/cream
 * theme overrides apply ONLY to portal pages and don't pollute the main site.
 */
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/portal/lib/auth";
import { ProtectedRoute } from "@/portal/components/ProtectedRoute";
import "@/portal/portal.css";

const LoginPage = lazy(() => import("@/portal/pages/Login"));
const AuthCallbackPage = lazy(() => import("@/portal/pages/AuthCallback"));
const IndexPage = lazy(() => import("@/portal/pages/Index"));
const NotFoundPage = lazy(() => import("@/portal/pages/NotFound"));
const ProjectDashboard = lazy(() => import("@/portal/pages/portal/ProjectDashboard"));
const SectionForm = lazy(() => import("@/portal/pages/portal/SectionForm"));
const AssetsPage = lazy(() => import("@/portal/pages/portal/AssetsPage"));
const ReviewPage = lazy(() => import("@/portal/pages/portal/ReviewPage"));
const AdminDashboard = lazy(() => import("@/portal/pages/admin/AdminDashboard"));
const NewProjectPage = lazy(() => import("@/portal/pages/admin/NewProject"));
const ProjectAdminView = lazy(() => import("@/portal/pages/admin/ProjectAdminView"));

const Loading = () => (
  <div className="mk-portal flex min-h-[60vh] items-center justify-center bg-background">
    <div className="text-primary text-lg animate-pulse">Loading…</div>
  </div>
);

export default function PortalRoutes() {
  return (
    <div className="mk-portal">
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="auth/callback" element={<AuthCallbackPage />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <IndexPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="p/:slug"
              element={
                <ProtectedRoute>
                  <ProjectDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="p/:slug/section/:sectionKey"
              element={
                <ProtectedRoute>
                  <SectionForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="p/:slug/assets"
              element={
                <ProtectedRoute>
                  <AssetsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="p/:slug/review"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireMkAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/new"
              element={
                <ProtectedRoute requireMkAdmin>
                  <NewProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/p/:slug"
              element={
                <ProtectedRoute requireMkAdmin>
                  <ProjectAdminView />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}
