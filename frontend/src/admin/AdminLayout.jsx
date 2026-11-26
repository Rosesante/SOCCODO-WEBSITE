import React from 'react';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/admin/login', { replace: true });
  };

  const isAdminHome = location.pathname === '/admin';

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-logo">
            <img src="/soccodo_logo.png" alt="SOCCODO Logo" />
          </div>

          <div>
            <h2>SOCCODO</h2>
            <p>Administration</p>
          </div>
        </div>

        <div className="admin-sidebar-section">
          <span className="admin-menu-label">MANAGEMENT</span>

          <NavLink to="/admin" end className="admin-nav-link">
            <span>⌂</span>
            Overview
          </NavLink>

          <NavLink to="/admin/stories" className="admin-nav-link">
            <span>▤</span>
            Success Stories
          </NavLink>

          <NavLink to="/admin/gallery" className="admin-nav-link">
            <span>▧</span>
            Gallery
          </NavLink>

          <NavLink to="/admin/events" className="admin-nav-link">
            <span>◷</span>
            Events
          </NavLink>

        </div>

        <div className="admin-sidebar-bottom">
          
          <button
            type="button"
            className="admin-view-website-link"
            onClick={() => navigate('/')}
          >
            <span>↗</span>
            View Website
          </button>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign Out
          </button>

          <p>SOCCODO Content Management</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <h3>Administration Portal</h3>
            <p>Manage your organization's website content.</p>
          </div>

          <div className="admin-user">
            <div className="admin-user-avatar">A</div>
            <span>Administrator</span>
          </div>
        </header>

        <section className="admin-content">
          {isAdminHome ? (
            <div className="admin-welcome">
              <span className="admin-welcome-label">
                SOCCODO CONTENT MANAGEMENT
              </span>

              <h1>Welcome to the Admin Portal</h1>

              <p>
                Manage and update the information displayed on the
                SOCCODO public website from one central place.
              </p>

              <div className="admin-management-grid">
                <NavLink to="/admin/stories" className="admin-management-card">
                  <span className="admin-card-icon">▤</span>
                  <h3>Success Stories</h3>
                  <p>Create, edit and publish community impact stories.</p>
                  <span className="admin-card-action">Manage stories →</span>
                </NavLink>

                <NavLink to="/admin/gallery" className="admin-management-card">
                  <span className="admin-card-icon">▧</span>
                  <h3>Gallery</h3>
                  <p>Upload and manage photos from SOCCODO activities.</p>
                  <span className="admin-card-action">Manage gallery →</span>
                </NavLink>

                <NavLink to="/admin/events" className="admin-management-card">
                  <span className="admin-card-icon">◷</span>
                  <h3>Events</h3>
                  <p>Create and update upcoming and past events.</p>
                  <span className="admin-card-action">Manage events →</span>
                </NavLink>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </section>

      </main>
    </div>
  );
};

export default AdminLayout;