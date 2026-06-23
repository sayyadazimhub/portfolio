import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { 
  FiGrid, 
  FiUser, 
  FiBook, 
  FiBriefcase, 
  FiFileText, 
  FiStar, 
  FiFolder, 
  FiMail, 
  FiMessageSquare, 
  FiAward,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'
import { FaTrophy } from 'react-icons/fa'

const links = [
  { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { label: 'About Me', path: '/about-me', icon: FiUser },
  { label: 'Education', path: '/education', icon: FiBook },
  { label: 'Work Experience', path: '/work-experience', icon: FiBriefcase },
  { label: 'Resume', path: '/resume', icon: FiFileText },
  { label: 'Skills', path: '/skills', icon: FiStar },
  { label: 'Projects', path: '/projects', icon: FiFolder },
  { label: 'Contact', path: '/contact', icon: FiMail },
  { label: 'Testimonials', path: '/testimonials', icon: FiMessageSquare },
  { label: 'Achievements', path: '/achievements', icon: FaTrophy },
  { label: 'Certificates', path: '/certificates', icon: FiAward },
]

function getLinkClass(isActive) {
  return isActive
    ? 'flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm text-white font-medium shadow-lg shadow-emerald-500/30 transition-all duration-300'
    : 'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1'
}

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-4 text-slate-900 border-b border-slate-200 md:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          <h2 className="text-lg font-bold text-slate-900">Admin</h2>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen flex flex-col bg-white border-r border-slate-200 shadow-2xl transition-transform duration-300 ease-out md:static md:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Portfolio</h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          <ul className="space-y-1.5">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => getLinkClass(isActive)}
                  >
                    <Icon size={18} className="shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:translate-x-1"
          >
            <FiLogOut size={18} className="shrink-0" />
            Sign out
          </NavLink>
        </div>
      </aside>
    </>
  )
}
