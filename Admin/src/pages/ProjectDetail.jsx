import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api.js'
import {
    FaArrowLeft,
    FaGithub,
    FaExternalLinkAlt,
    FaCalendarAlt,
    FaDatabase,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaBuilding,
    FaMapMarkerAlt,
    FaCode,
    FaFolderOpen
} from 'react-icons/fa'

export default function ProjectDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadProject()
    }, [id])

    const loadProject = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await apiService.getProjects()
            const foundProject = response.data?.data?.find(p => (p._id || p.id) === id)
            if (!foundProject) {
                setError('Project not found.')
                return
            }
            setProject(foundProject)
        } catch (err) {
            console.error(err)
            setError('Unable to load project details.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
                    <p className="text-slate-500 font-medium text-sm animate-pulse">Loading project details...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <button
                    onClick={() => navigate('/projects')}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                    <FaArrowLeft /> Back to Projects
                </button>

                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700 shadow-sm flex items-center gap-3">
                    <FaTimesCircle className="h-5 w-5 shrink-0" />
                    <span className="font-medium">{error || 'Project not found.'}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12 text-slate-700">
            {/* Navigation and Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/projects')}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                    <FaArrowLeft /> Back to List
                </button>

                <div className="flex gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${project.projectCategory === 'Personal'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                        {project.projectCategory || 'Personal'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${project.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                        {project.status === 'Completed' ? <FaCheckCircle /> : <FaClock />}
                        {project.status || 'Completed'}
                    </span>
                </div>
            </div>

            {/* Main Container Card */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">

                {/* Cover Banner */}
                <div className="relative h-44 sm:h-52 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-300 via-slate-900 to-indigo-900"></div>
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
                    <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-sky-500/10 blur-2xl"></div>
                </div>

                {/* Profile Header */}
                <div className="relative px-6 sm:px-8 pb-6 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 sm:-mt-20">
                        {/* Project/Client Logo Frame */}
                        <div className="h-32 w-32 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl">
                            {project.clientLogo?.url ? (
                                <img
                                    src={project.clientLogo.url}
                                    alt="Client brand"
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-bold text-4xl shadow-inner">
                                    {project.projectCategory === 'Client' ? <FaBuilding /> : <FaCode />}
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-1.5 mb-2 sm:mb-0">
                            <div className="inline-block text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                                {project.projectType || 'Full Stack'}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{project.projectName}</h1>
                            {project.clientName && (
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                                    <FaBuilding className="text-slate-400" />
                                    <span>Client Name: {project.clientName}</span>
                                    {project.clientCity && (
                                        <span className="flex items-center gap-1 text-slate-400 font-medium">
                                            <FaMapMarkerAlt />
                                            Client Location: {project.clientCity}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-3">

                        {/* Left Column: Metadata & External Actions */}
                        <div className="space-y-6 lg:col-span-1 lg:border-r lg:border-slate-100 lg:pr-8">

                            {/* Resource Links */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Project Assets</h3>
                                <div className="space-y-2">
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/10 transition-all"
                                        >
                                            <FaExternalLinkAlt /> Visit Live Website
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-3 text-sm font-bold text-white shadow-md transition-all"
                                        >
                                            <FaGithub /> GitHub Repository
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* System Metadata details */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Details</h3>
                                <div className="space-y-3.5 text-sm text-slate-600">
                                    <div className="flex items-start gap-2.5">
                                        <FaDatabase className="mt-0.5 text-slate-400 shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Document ID</p>
                                            <p className="font-mono text-xs text-slate-800 select-all">{project._id || project.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <FaFolderOpen className="mt-0.5 text-slate-400 shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Configuration Category</p>
                                            <p className="text-slate-800 font-semibold">{project.projectCategory}</p>
                                        </div>
                                    </div>

                                    {project.createdAt && (
                                        <div className="flex items-start gap-2.5">
                                            <FaCalendarAlt className="mt-0.5 text-slate-400 shrink-0" />
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Registered Date</p>
                                                <p className="text-slate-800 font-medium">
                                                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Visual Mockups & Core Description */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
                                <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line font-medium">
                                    {project.description}
                                </p>
                            </div>

                            {/* Technologies stack */}
                            {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Built With</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full font-bold hover:bg-slate-200 transition-colors"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Device Visual Mockups Showcase */}
                            <div className="space-y-6 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Device Preview Assets</h3>
                                <div className="grid gap-6 sm:grid-cols-2 bg-slate-50 p-6 rounded-2xl border border-slate-100 items-center justify-center">

                                    {/* Laptop Mockup */}
                                    {project.desktopImage?.url ? (
                                        <div className="w-full max-w-sm mx-auto">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mb-2">Desktop Mockup</p>
                                            <div className="relative border-4 border-slate-800 rounded-t-xl overflow-hidden bg-slate-950 aspect-[16/10] shadow-xl">
                                                <img
                                                    src={project.desktopImage.url}
                                                    alt="Desktop layout"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            {/* Base stand */}
                                            <div className="w-16 h-3 bg-slate-800 mx-auto" />
                                            <div className="w-24 h-1.5 bg-slate-900 mx-auto rounded-b shadow-inner" />
                                        </div>
                                    ) : (
                                        <div className="text-xs font-semibold text-slate-400 text-center py-8 bg-slate-100/50 rounded-xl">No desktop layout image</div>
                                    )}

                                    {/* Smartphone Mockup */}
                                    {project.mobileImage?.url ? (
                                        <div className="w-full max-w-[140px] mx-auto">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mb-2">Mobile Mockup</p>
                                            <div className="relative border-[5px] border-slate-800 rounded-[2rem] overflow-hidden bg-slate-950 aspect-[9/19] shadow-xl">
                                                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-800 rounded-full z-10" />
                                                <img
                                                    src={project.mobileImage.url}
                                                    alt="Mobile layout"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs font-semibold text-slate-400 text-center py-8 bg-slate-100/50 rounded-xl">No mobile layout image</div>
                                    )}

                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
