import { ArrowRight, LogOut } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import SignInPrompt from "@/components/SignInPrompt";

export default function Admin() {
  const auth = useAuth();
  const [, navigate] = useLocation();
  const impact = trpc.admin.impact.useQuery(undefined, {
    enabled: Boolean(auth.user?.role === "admin"),
  });

  useEffect(() => {
    if (!auth.loading && auth.user && auth.user.role !== "admin") {
      navigate("/app");
    }
  }, [auth.loading, auth.user, navigate]);

  if (auth.loading) {
    return <div className="center-page"><div className="loading-spinner" /></div>;
  }

  if (!auth.user) {
    return <SignInPrompt title="Open the admin page." description="Sign in with the configured root administrator account to continue." />;
  }

  if (auth.user.role !== "admin") {
    return <div className="center-page"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="shell app-header-inner">
          <Link href="/" className="brand-mark">
            <span className="brand-loop"><span /></span>
            <span className="brand-name">Food<span>Share</span></span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/app" className="button button-ghost button-small">User workspace</Link>
            <button type="button" className="button button-dark button-small" onClick={() => auth.logout().then(() => navigate("/"))}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="shell app-main">
        <div className="workspace-content">
          <div className="workspace-heading">
            <div>
              <p className="eyebrow">Admin Dashboard</p>
              <h1>Monitor the <em>platform.</em></h1>
              <p>Review donation, delivery, user, and system activity from real records.</p>
            </div>
            <span className="count-badge">Root administrator</span>
          </div>

          <div className="workspace-stat-row">
            <div><span>Total donations</span><strong>{impact.data?.offers ?? 0}</strong></div>
            <div><span>Completed deliveries</span><strong>{impact.data?.completed ?? 0}</strong></div>
            <div><span>Food servings saved</span><strong>{impact.data?.servings ?? 0}</strong></div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Administration modules</p>
              <h2>System management</h2>
            </div>
          </div>

          <div className="role-grid admin-module-grid">
            <div className="role-card role-blue">
              <span className="role-title">User management</span>
              <span>Review registered donors, NGOs, volunteers, and administrators.</span>
            </div>
            <div className="role-card role-green">
              <span className="role-title">Donation management</span>
              <span>Monitor available, accepted, delivered, and expired food donations.</span>
            </div>
            <div className="role-card role-apricot">
              <span className="role-title">Reports</span>
              <span>Generate reports from actual donation and delivery records.</span>
            </div>
          </div>

          {impact.error && (
            <div className="login-error-banner" style={{ marginTop: "20px" }}>
              {impact.error.message || "Unable to load administrator data."}
            </div>
          )}

          <Link href="/app" className="inline-link" style={{ marginTop: "24px" }}>
            Return to user workspace <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}
