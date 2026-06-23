import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart,
  FaGithub
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 w-full overflow-hidden mt-auto relative">
      {/* Top accent bar matching navbar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 lg:pt-16 lg:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-8 text-center md:text-left">

          {/* 🏢 BRAND COLUMN */}
          <div className="flex flex-col items-center md:items-start space-y-5 md:col-span-12 lg:col-span-5">
            {/* Matching Navbar Logo Style, but larger for footer */}
            <Link to="/" className="flex items-center gap-4 shrink-0 group">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all duration-300">
                <img
                  src={logo}
                  alt="Sayyad Portfolio"
                  className="h-10 w-10 object-contain transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col leading-none justify-center text-left">
                <span className="font-serif font-black text-black text-xl tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
                  Sayyad Azim
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 mt-1">
                  Portfolio
                </span>
              </div>
            </Link>

            <p className="text-base text-slate-600 leading-relaxed font-medium max-w-sm">
              Delivering transformative digital solutions and modern web applications that propel businesses into the future.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: FaGithub, href: "https://github.com/sayyadazimhub", label: "GitHub", colorStyle: "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-800 hover:border-slate-800 hover:text-white" },
                { icon: FaLinkedinIn, href: "https://www.linkedin.com/in/sayyadazimmern/", label: "LinkedIn", colorStyle: "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white" },
                { icon: FaInstagram, href: "https://www.instagram.com/royal.az_", label: "Instagram", colorStyle: "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-600 hover:border-pink-600 hover:text-white" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${social.colorStyle}`}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* 🔗 QUICK LINKS */}
          <div className="md:col-span-5 lg:col-span-3 lg:col-start-7 flex flex-col items-center md:items-start">
            <h4 className="font-serif font-black text-black text-lg mb-4 tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2 flex flex-col items-center md:items-start">
              {[
                { name: "Home", href: "/" },
                { name: "About Me", href: "/about" },
                { name: "Projects", href: "/projects" },
                { name: "Resume", href: "/resume" },
                { name: "Contact", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group relative inline-flex items-center"
                  >
                    <span className="relative flex flex-col items-start gap-0.5">
                      <span className="font-mono text-xs uppercase tracking-[0.15em] text-slate-600 font-bold transition-colors duration-300 group-hover:text-indigo-600">
                        {link.name}
                      </span>
                      <span className="block h-[2px] w-0 bg-indigo-600 transition-[width] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📍 CONTACT INFO */}
          <div className="md:col-span-7 lg:col-span-3 flex flex-col items-center md:items-start">
            <h4 className="font-serif font-black text-black text-lg mb-6 tracking-tight">
              Get in Touch
            </h4>
            <div className="space-y-6 w-full flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:border-amber-500 group-hover:text-white group-hover:bg-amber-500 transition-all duration-300 shrink-0 shadow-sm mt-0 md:mt-0.5">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Address</p>
                  <p className="text-[13px] text-slate-800 font-semibold leading-relaxed group-hover:text-amber-600 transition-colors cursor-default">
                    Hyderabad, India
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 group-hover:border-emerald-500 group-hover:text-white group-hover:bg-emerald-500 transition-all duration-300 shrink-0 shadow-sm mt-0 md:mt-0.5">
                  <FaPhoneAlt size={12} />
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Mobile</p>
                  <p className="text-[13px] text-slate-800 font-semibold group-hover:text-emerald-600 transition-colors cursor-default leading-none">
                    +91 907 590 9896
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 group-hover:border-blue-500 group-hover:text-white group-hover:bg-blue-500 transition-all duration-300 shrink-0 shadow-sm mt-0 md:mt-0.5">
                  <FaEnvelope size={14} />
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Email</p>
                  <a href="mailto:azimsayyad90@gmail.com" className="text-[13px] text-slate-800 font-semibold hover:text-blue-600 group-hover:text-blue-600 transition-colors block leading-none">
                    azimsayyad90@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="md:mt-12 mt-10 pt-6 md:pt-9 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600 text-center md:text-left">
              © {new Date().getFullYear()} Portfolio- <span className="font-black text-black">Sayyad Azim. </span>All Rights Reserved.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 group cursor-default">
              Made with <FaHeart className="text-rose-600 text-sm animate-pulse group-hover:scale-125 transition-transform duration-300" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}