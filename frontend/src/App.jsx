<<<<<<< HEAD
import { useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contacts from './pages/Contacts.jsx'
import Gallery from './pages/Gallery.jsx'
import News from './pages/News.jsx'
import Programs from './pages/Programs.jsx'
import Projects from './pages/Projects.jsx'
import GetInvolved from './pages/GetInvolved.jsx'

const PAGES = {
  Home,
  About,
  Contacts,
  Gallery,
  News,
  Programs,
  Projects,
  GetInvolved,
}

const LINKS = [
  { to: 'Home', label: 'Home' },
  { to: 'About', label: 'About' },
  { to: 'Programs', label: 'Programs' },
  { to: 'Projects', label: 'Projects' },
  { to: 'News', label: 'News' },
  { to: 'Gallery', label: 'Gallery' },
  { to: 'Contacts', label: 'Contacts' },
  { to: 'GetInvolved', label: 'Get Involved' },
]

function App() {
  const [page, setPage] = useState('Home')
  const Page = PAGES[page] || Home

  return (
    <>
      <nav className="navbar">
        <a href="#" className="brand" onClick={(e) => { e.preventDefault(); setPage('Home') }}>SOCCODO</a>
        <div className="nav-links">
          {LINKS.map((link) => (
            <a
              key={link.to}
              href="#"
              className={page === link.to ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setPage(link.to) }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
      <main><Page /></main>
    </>
  )
}
=======
import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import WhoWeAre from './pages/WhoWeAre';
import WhatWeDo from './pages/WhatWeDo';
import SuccessStories from './pages/Success-stories';
import SuccessStoriesAdmin from './admin/pages/SuccessStoriesAdmin';
import Gallery from './pages/Gallery';
import GalleryAdmin from './admin/pages/GalleryAdmin';
import Contact from './pages/Contact';
import Events from './pages/Events';

import AdminLogin from './admin/pages/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import EventsAdmin from './admin/pages/EventsAdmin';

import './App.css';

const ScrollToSection = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sectionId = decodeURIComponent(hash.slice(1));
    let attempts = 0;

    const findSection = () => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else if (attempts < 10) {
        attempts += 1;
        requestAnimationFrame(findSection);
      }
    };

    requestAnimationFrame(findSection);
  }, [pathname, hash]);

  return null;
};

const PublicWebsite = () => {
  return (
    <div className="app">
      <ScrollToSection />
      <Navbar />
>>>>>>> 1f78563f2196f66bdd04770135321f7e5fc3b148

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/what-we-do" element={<WhatWeDo />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
      </Routes>

      <footer className="site-footer">
        <p>
          &copy; {new Date().getFullYear()} SOCCODO. All rights reserved.
        </p>
        <a href="/">Back to Home ↑</a>
      </footer>
    </div>
  );
};


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/*" element={<PublicWebsite />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="stories" element={<SuccessStoriesAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="events" element={<EventsAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
