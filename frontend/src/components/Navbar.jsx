import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const navigationMenus = [
  {
    label: 'Who We Are',
    path: '/who-we-are',
    items: [
      { label: 'Overview', path: '/who-we-are' },
      { label: 'Our Mission & Vision', path: '/who-we-are#mission' },
      { label: 'Our Values', path: '/who-we-are#values' },
      { label: 'Our Team', path: '/who-we-are#team' },
    ],
  },
  {
    label: 'What We Do',
    path: '/what-we-do',
    items: [
      { label: 'All Our Focus Areas', path: '/what-we-do' },
      { label: 'Community Development', path: '/what-we-do#community' },
      { label: 'Education & Youth', path: '/what-we-do#education' },
      { label: 'Climate & Environment', path: '/what-we-do#environment' },
      { label: 'Women & Social Welfare', path: '/what-we-do#women' },
      { label: 'Water & Sanitation', path: '/what-we-do#water' },
      { label: 'Disaster Relief', path: '/what-we-do#disaster' },
    ],
  },
  {
    label: 'Success Stories',
    path: '/success-stories',
    items: [
      { label: 'All Stories', path: '/success-stories' },
      {
        label: 'Community Development',
        path: '/success-stories?category=Community%20Development#latest-stories',
      },
      {
        label: 'Climate & Environment',
        path: '/success-stories?category=Climate%20%26%20Environment#latest-stories',
      },
      {
        label: 'Education & Youth',
        path: '/success-stories?category=Education%20%26%20Youth#latest-stories',
      },
      {
        label: 'Women & Social Welfare',
        path: '/success-stories?category=Women%20%26%20Social%20Welfare#latest-stories',
      },
      {
        label: 'Water & Sanitation',
        path: '/success-stories?category=Water%20%26%20Sanitation#latest-stories',
      },
      {
        label: 'Disaster Relief',
        path: '/success-stories?category=Disaster%20Relief#latest-stories',
      },
    ],
  },
  {
    label: 'Gallery',
    path: '/gallery',
    items: [
      { label: 'All Photos', path: '/gallery' },
      {
        label: 'Community Development',
        path: '/gallery?category=Community#gallery-photos',
      },
      {
        label: 'Climate & Environment',
        path: '/gallery?category=Environment#gallery-photos',
      },
      {
        label: 'Education & Youth',
        path: '/gallery?category=Education#gallery-photos',
      },
      {
        label: 'Women & Social Welfare',
        path: '/gallery?category=Social%20Welfare#gallery-photos',
      },
      {
        label: 'Water & Sanitation',
        path: '/gallery?category=Water%20%26%20Sanitation#gallery-photos',
      },
      {
        label: 'Disaster Relief',
        path: '/gallery?category=Disaster%20Relief#gallery-photos',
      },
    ],
  },

  {
    label: 'Events',
    path: '/events',
    items: [
      { label: 'All Events', path: '/events' },
      { label: 'Past Events', path: '/events?status=past#events-list' },
      { label: 'Ongoing Events', path: '/events?status=ongoing#events-list' },
      { label: 'Upcoming Events', path: '/events?status=upcoming#events-list' },
    ],
  },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState('')
  const location = useLocation()

  const closeMenus = () => {
    setMobileOpen(false)
    setActiveDropdown('')
  }

  const toggleDropdown = (menu) => {
    setActiveDropdown((current) => (current === menu ? '' : menu))
  }

  const isCurrentPage = (path) => location.pathname === path

  return (
    <header className="site-header">
      {/* Top branding row */}
      <div className="brand-bar">
        <Link to="/" className="navbar-logo" onClick={closeMenus}>
          <img
            src="/soccodo_logo.png"
            alt="SOCCODO Logo"
            className="logo-image"
          />
        </Link>

        <div className="brand-heading">
          <h1>Social, Climate and Community Development Organization</h1>
          
        </div>
      </div>

      {/* Main navigation row */}
      <nav className="navbar" aria-label="Main navigation">
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => {
            setMobileOpen((current) => !current)
            setActiveDropdown('')
          }}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="navbar-links"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

        <div
          id="navbar-links"
          className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}
        >
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'current-page' : ''}`}
            onClick={closeMenus}
          >
            Home
          </Link>

          {navigationMenus.map((menu) => (
            <div
              key={menu.label}
              className={`nav-item ${
                activeDropdown === menu.label ? 'dropdown-open' : ''
              } ${isCurrentPage(menu.path) ? 'current-menu' : ''}`}
              onMouseEnter={() => {
                if (window.matchMedia('(min-width: 901px)').matches) {
                  setActiveDropdown(menu.label)
                }
              }}
              onMouseLeave={() => {
                if (window.matchMedia('(min-width: 901px)').matches) {
                  setActiveDropdown('')
                }
              }}
            >
              <div className="nav-dropdown-heading">
                <Link
                  to={menu.path}
                  className={`nav-link ${
                    isCurrentPage(menu.path) ? 'current-page' : ''
                  }`}
                  onClick={closeMenus}
                >
                  {menu.label}
                </Link>

                <button
                  type="button"
                  className="dropdown-toggle"
                  aria-label={`Toggle ${menu.label} submenu`}
                  aria-expanded={activeDropdown === menu.label}
                  onClick={() => toggleDropdown(menu.label)}
                >
                  <span className="dropdown-arrow">⌄</span>
                </button>
              </div>

              <div className="dropdown-menu">
                {menu.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={closeMenus}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Link
            to="/contact"
            className={`nav-contact ${
              location.pathname === '/contact' ? 'current-page' : ''
            }`}
            onClick={closeMenus}
          >
            Contact Us <span aria-hidden="true">→</span>
          </Link>

          <Link
            to="/admin/login"
            className="admin-login-nav"
            onClick={closeMenus}
          >
            <span aria-hidden="true">🔐</span>
            Admin Login
          </Link>

        </div>
      </nav>
    </header>
  )
}

export default Navbar
