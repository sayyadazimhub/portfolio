import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiService } from "../utils/api";
import ProjectCard from "../components/layout/ProjectCard";
import {
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCode,
  FaChevronDown,
} from "react-icons/fa";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterTech, setFilterTech] = useState("All");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterType, filterTech]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiService.getProjects();
        const projects = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const orderedProjects = projects.sort((a, b) => a.order - b.order);
        const completedProjects = orderedProjects.filter((p) => p.status === "Completed");
        setProjects(completedProjects);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const allTechs = useMemo(() => {
    const techs = new Set();
    projects.forEach((p) => {
      const t = p.technologies || p.techStack || [];
      t.forEach((tech) => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, [projects]);

  const allTypes = useMemo(() => {
    const types = new Set();
    projects.forEach((p) => {
      if (
        p.projectType &&
        p.projectType !== "Personal" &&
        p.projectType !== "Client"
      ) {
        types.add(p.projectType);
      }
    });
    return Array.from(types).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        (project.projectName || project.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      let matchesCategory = true;
      if (filterCategory !== "All") {
        const cat = project.projectCategory;
        const typ = project.projectType;
        matchesCategory = cat === filterCategory || typ === filterCategory;
      }

      let matchesTech = true;
      if (filterTech !== "All") {
        const techs = project.technologies || project.techStack || [];
        matchesTech = techs.includes(filterTech);
      }

      let matchesType = true;
      if (filterType !== "All") {
        matchesType = project.projectType === filterType;
      }

      return matchesSearch && matchesCategory && matchesTech && matchesType;
    });
  }, [projects, searchTerm, filterCategory, filterTech, filterType]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  return (
    <section className="bg-slate-50 pt-12 sm:pb-16 pb-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50/50 via-slate-50/30 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Editorial Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-12 lg:mb-18">
          {/* Left Content */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left px-2 sm:px-0">
            <div
              className="inline-flex items-center gap-2 sm:gap-3 mb-3 lg:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full border border-slate-100 shadow-sm"
            >
              <FaCode className="text-indigo-600 text-sm sm:text-base" />
              <span className="font-mono text-[9px] sm:text-[11px] md:text-xs uppercase tracking-[0.2em] text-slate-800 font-bold">
                Development Portfolio
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight font-serif mb-3 lg:mb-6 leading-[1.15] sm:leading-[1.1]"
            >
              Explore My{" "}
              <span className="inline mt-1 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                Archive
              </span>
            </h1>

            <p
              className="text-slate-800 font-medium text-base md:text-lg leading-relaxed sm:leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10"
            >
              A curated collection of my latest work, scalable architectures,
              and intuitive web interfaces built with modern technologies.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto"
            >
              <button
                onClick={() =>
                  window.scrollTo(0, 600)
                }
                className="w-full sm:w-auto group relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase font-bold tracking-[0.15em] text-white border border-slate-900 rounded-lg overflow-hidden px-5 py-3.5 md:px-6 md:py-4 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
              >
                <span className="relative z-10">Browse Work</span>
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 md:px-6 md:py-4 bg-white text-black border-2 border-black rounded-lg font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em] font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
              >
                Let's Talk
              </button>
            </div>
          </div>

          {/* Right Graphic */}
          <div
            className="w-full lg:w-[45%] relative hidden lg:flex justify-center lg:justify-end"
          >
            {/* Refined Hanging Letters Graphic */}
            <div className="relative w-full max-w-[450px] aspect-square rounded-[2.5rem] bg-white/95 shadow-2xl shadow-indigo-500/10 overflow-hidden flex items-center justify-center border border-white/60">
              {/* Inner Ambient Glows */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/20 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/20 blur-[80px] rounded-full pointer-events-none"></div>

              {/* Grid overlay for tech feel */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

              {/* Hanging Letters */}
              <div className="flex gap-4 sm:gap-6 items-start h-full pt-10 sm:pt-16 relative z-10">
                {["W", "O", "R", "K"].map((letter, i) => {
                  // Generate staggered swinging animation
                  const swingDuration = 3.5 + i * 0.3;
                  const wireHeight =
                    i % 2 !== 0 ? "h-24 sm:h-36" : "h-16 sm:h-24";
                  const cardMargin =
                    i % 2 !== 0 ? "mt-24 sm:mt-36" : "mt-16 sm:mt-24";

                  return (
                    <div
                      key={i}
                      className="relative flex flex-col items-center"
                    >
                      {/* The Hanging Wire */}
                      <div
                        className={`w-[2px] ${wireHeight} bg-gradient-to-b from-slate-300 to-slate-400 absolute top-0 rounded-full`}
                      ></div>

                      {/* Pivot Point Top */}
                      <div className="absolute top-0 w-3 h-3 rounded-full bg-slate-200 shadow-sm border-2 border-white -translate-y-1"></div>

                      {/* The Letter Card */}
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden ${cardMargin} group`}
                      >
                        {/* Connection Joint on Card */}
                        <div className="absolute top-0 w-6 h-2.5 bg-slate-100 rounded-b-md border-b border-x border-slate-200 flex justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-0.5"></div>
                        </div>

                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

                        {/* Letter */}
                        <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-cyan-500 drop-shadow-sm mt-1">
                          {letter}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <>
            {/* Search Bar Skeleton */}
            <div className="mb-10 sm:mb-12 w-full max-w-7xl mx-auto px-4 sm:px-0">
              <div className="w-full h-14 md:h-16 bg-white rounded-full border border-slate-200 shadow-sm flex items-center px-4 animate-pulse">
                <div className="w-5 h-5 bg-slate-200 rounded-full mr-4"></div>
                <div className="flex-1 h-5 bg-slate-100 rounded-md max-w-md"></div>
                <div className="hidden sm:block w-[1px] h-8 bg-slate-200 mx-4"></div>
                <div className="w-24 md:w-32 h-5 bg-slate-100 rounded-md"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col min-h-[400px] relative overflow-hidden"
              >
                <div className="w-full aspect-[16/10] bg-slate-200 animate-pulse rounded-2xl mb-6"></div>
                <div className="px-2 flex-grow flex flex-col">
                  <div className="flex gap-2 mb-4">
                    <div className="w-16 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="w-20 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                  </div>
                  <div className="w-3/4 h-7 bg-slate-300 animate-pulse rounded-lg mb-3"></div>
                  <div className="space-y-2 mb-6">
                    <div className="w-full h-4 bg-slate-200 animate-pulse rounded"></div>
                    <div className="w-5/6 h-4 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                  <div className="mt-auto flex gap-3">
                    <div className="w-10 h-10 bg-slate-200 animate-pulse rounded-full"></div>
                    <div className="w-10 h-10 bg-slate-200 animate-pulse rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        ) : error ? (
          <div
            className="text-center py-16 bg-white rounded-[2rem] border border-rose-100 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto mt-10"
          >
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 shadow-sm mb-6">
              <span className="text-rose-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 font-serif mb-2 tracking-tight">
              Unable to load projects
            </h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-8">
              {error || "Something went wrong while fetching the portfolio data. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-slate-900 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg hover:bg-rose-500 transition-colors cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div
            className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center max-w-3xl mx-auto mt-10"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shadow-sm mb-6">
              <FaCode className="text-indigo-400" size={28} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 font-serif mb-3 tracking-tight">
              Projects Coming Soon
            </h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              I'm currently putting the finishing touches on some exciting new case studies. Check back shortly to explore my latest work!
            </p>
          </div>
        ) : (
          <>
            {/* Segmented Control Filter Section */}
            {projects.length > 0 && (
              <div
                className="mb-10 sm:mb-12 w-full max-w-7xl mx-auto px-4 sm:px-0 sticky top-24 z-30"
              >
                <div className="flex flex-row gap-2 md:gap-0 items-center justify-between bg-white/95 p-2 md:py-1 md:px-4 rounded-full border border-slate-200 shadow-sm shadow-indigo-500/5">
                  {/* Refined Search Bar */}
                  <div className="relative flex-1 min-w-0 w-full lg:max-w-md py-1 md:py-2 px-1 md:px-0">
                    <div className="absolute inset-y-0 left-0 pl-6 lg:pl-4 flex items-center pointer-events-none">
                      <FaSearch className="text-slate-400" size={15} />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search projects by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-200 outline-none focus:ring-4 focus:ring-indigo-500/10 rounded-full py-2.5 pl-12 lg:pl-11 pr-16 text-[14px] font-medium text-slate-800 placeholder-slate-400 transition-all duration-300 shadow-inner focus:shadow-md"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 lg:pr-2 flex items-center gap-1.5">
                        {searchTerm ? (
                          <button
                            key="clear"
                            onClick={() => setSearchTerm("")}
                            className="p-1.5 bg-white text-slate-400 hover:text-rose-500 rounded-full border border-slate-200 shadow-sm transition-colors cursor-pointer"
                          >
                            <FaTimes size={10} />
                          </button>
                        ) : (
                          <div
                            key="hint"
                            className="hidden sm:flex items-center justify-center px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-400 shadow-sm mr-1 pointer-events-none"
                          >
                            ⌘K
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-[1px] h-8 bg-slate-200 shrink-0 mx-2 md:mx-4"></div>

                  {/* Dropdown Filter */}
                  <div className="relative w-[130px] sm:w-40 md:w-56 lg:w-48 shrink-0 py-1 md:py-2 px-1 md:px-0">
                    <div
                      onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                      className="w-full flex items-center justify-between bg-slate-100/50 hover:bg-slate-100 border border-slate-200 rounded-full py-2.5 px-3 md:px-4 cursor-pointer transition-all duration-300"
                    >
                      <span className="text-[12px] md:text-[14px] font-medium text-slate-800 truncate mr-1 md:mr-2">
                        {filterType === 'All' ? 'All Works' : filterType}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                          {filterType !== 'All' && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setFilterType('All');
                              }}
                              className="p-1 bg-white text-slate-400 hover:text-rose-500 rounded-full border border-slate-200 shadow-sm transition-colors cursor-pointer"
                            >
                              <FaTimes size={10} />
                            </div>
                          )}
                        <FaChevronDown className={`text-slate-400 text-xs transition-transform duration-300 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                      {isTypeDropdownOpen && (
                        <div
                          className="absolute top-full mt-2 left-0 right-0 lg:right-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-indigo-500/10 overflow-hidden z-50 py-2"
                        >
                          <button
                            onClick={() => { setFilterType("All"); setIsTypeDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors cursor-pointer ${filterType === 'All' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                          >
                            All Works
                          </button>
                          {allTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => { setFilterType(type); setIsTypeDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors cursor-pointer ${filterType === type ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredProjects.length === 0 && projects.length > 0 ? (
              <div
                className="text-center py-16 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm mb-6">
                  <FaSearch className="text-slate-300" size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 font-serif mb-2">
                  No projects found
                </h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                  We couldn't find any projects matching your current filters.
                  Try adjusting your search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("All");
                  }}
                  className="mt-8 px-8 py-3 bg-black text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Animated Grid Layout */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
                >
                    {paginatedProjects.map((project, index) => (
                      <div
                        key={project._id}
                      >
                        <ProjectCard
                          project={project}
                          index={index}
                          onClick={() => navigate(`/projects/${project._id}`)}
                        />
                      </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 md:mt-12 flex items-center justify-center gap-1.5 md:gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo(0, 300);
                      }}
                      disabled={currentPage === 1}
                      className="p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:hover:text-slate-500 disabled:hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <FaChevronLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </button>

                    <div className="flex gap-1.5 md:gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo(0, 300);
                          }}
                          className={`w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl font-mono text-[10px] md:text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${currentPage === i + 1
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 shadow-sm"
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages),
                        );
                        window.scrollTo(0, 300);
                      }}
                      disabled={currentPage === totalPages}
                      className="p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:hover:text-slate-500 disabled:hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <FaChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
