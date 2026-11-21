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

export default App
