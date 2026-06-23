import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';
import axios from 'axios';
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaBook, FaLink } from 'react-icons/fa';

const GithubSection = () => {
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('last');

    const currentYear = new Date().getFullYear();
    const years = ['last', currentYear, currentYear - 1, currentYear - 2];

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                const [profileRes, reposRes] = await Promise.all([
                    axios.get('https://api.github.com/users/sayyadazimhub'),
                    axios.get('https://api.github.com/users/sayyadazimhub/repos?sort=updated&per_page=6')
                ]);
                setProfile(profileRes.data);
                setRepos(reposRes.data);
            } catch (error) {
                console.error('Error fetching GitHub data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGithubData();
    }, []);

    return (
        <section id="github" className="py-8 md:py-12 lg:py-16 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3 text-purple-600 font-bold flex items-center gap-2"
                        >
                            <span className="w-6 h-0.5 bg-purple-600"></span>
                            Open Source
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-serif leading-[1.1] tracking-tight"
                        >
                            GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">Activity.</span>
                        </motion.h3>
                    </div>
                </div>

                {loading ? (
                    <div className="w-full max-w-6xl mx-auto animate-pulse flex flex-col gap-8">
                        <div className="h-40 bg-slate-200/60 rounded-xl w-full"></div>
                        <div className="h-64 bg-slate-200/60 rounded-xl w-full"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-32 bg-slate-200/60 rounded-xl w-full"></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 max-w-6xl mx-auto">
                        {/* Profile Stats */}
                        {profile && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-8"
                            >
                                <div className="flex-shrink-0 relative">
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.name}
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-purple-50 shadow-md"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg">
                                        <FaGithub className="text-xl" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h4 className="text-2xl font-bold text-slate-800 mb-2">{profile.name || profile.login}</h4>
                                    <p className="text-slate-600 mb-6 max-w-lg">{profile.bio}</p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <FaBook className="text-purple-500" />
                                            <span className="font-bold">{profile.public_repos}</span>
                                            <span className="text-slate-500 text-sm">Repos</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <FaUsers className="text-indigo-500" />
                                            <span className="font-bold">{profile.followers}</span>
                                            <span className="text-slate-500 text-sm">Followers</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <FaUsers className="text-cyan-500" />
                                            <span className="font-bold">{profile.following}</span>
                                            <span className="text-slate-500 text-sm">Following</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <a
                                        href={profile.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        <FaGithub /> View Profile
                                    </a>
                                </div>
                            </motion.div>
                        )}

                        {/* Calendar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <FaCodeBranch className="text-purple-500" /> Contribution Graph
                                </h4>
                                <div className="flex bg-slate-100/80 p-1.5 rounded-2xl">
                                    {years.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => setSelectedYear(year)}
                                            className={`relative px-4 py-1.5 rounded-xl text-sm font-bold transition-colors duration-300 ${selectedYear === year
                                                    ? 'text-purple-600'
                                                    : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                        >
                                            {selectedYear === year && (
                                                <motion.div
                                                    layoutId="activeYearTab"
                                                    className="absolute inset-0 bg-white rounded-xl shadow-sm"
                                                    initial={false}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <span className="relative z-10">{year === 'last' ? 'Last Year' : year}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center w-full overflow-x-auto pb-4">
                                <div className="min-w-[800px]">
                                    <GitHubCalendar
                                        username="sayyadazimhub"
                                        colorScheme="light"
                                        blockSize={12}
                                        blockMargin={5}
                                        fontSize={14}
                                        year={selectedYear}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Repositories */}
                        <div>
                            <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <FaStar className="text-amber-400" /> Recent Repositories
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {repos.map((repo, idx) => (
                                    <motion.a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={repo.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                                        className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h5 className="font-bold text-lg text-slate-800 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                                                <FaBook className="text-slate-400 group-hover:text-purple-500" />
                                                <span className="truncate max-w-[200px]">{repo.name}</span>
                                            </h5>
                                            <FaLink className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-2">
                                            {repo.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                    <span>{repo.language || 'Unknown'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <FaStar className="text-amber-400" /> {repo.stargazers_count}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaCodeBranch /> {repo.forks_count}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GithubSection;
