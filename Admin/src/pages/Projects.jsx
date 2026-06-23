import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api.js'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiX, FiFolder, FiExternalLink, FiStar } from 'react-icons/fi'

const initialForm = {
  projectName: '',
  description: '',
  projectCategory: 'Personal',
  projectType: 'Full Stack',
  liveUrl: '',
  githubUrl: '',
  clientName: '',
  clientCity: '',
  featured: false,
  status: 'Completed',
  order: 0,
  technologies: '',
  desktopImage: null,
  mobileImage: null,
  clientLogo: null,
  currentDesktopImage: '',
  currentMobileImage: '',
  currentClientLogo: '',
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const navigate = useNavigate()

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')

  // Bulk Selection States
  const [selectedIds, setSelectedIds] = useState([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    setSelectedIds([]) // Reset selections
    try {
      const response = await apiService.getProjects()
      setProjects(response.data?.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return projects.filter((p) => {
      const matchesSearch = !query || 
        (p.projectName?.toLowerCase().includes(query)) ||
        (p.description?.toLowerCase().includes(query)) ||
        (p.technologies?.some(t => t.toLowerCase().includes(query)))

      const matchesCategory = categoryFilter === 'all' || p.projectCategory === categoryFilter
      const matchesType = typeFilter === 'all' || p.projectType === typeFilter
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      
      let matchesFeatured = true
      if (featuredFilter === 'featured') matchesFeatured = p.featured === true
      if (featuredFilter === 'standard') matchesFeatured = p.featured !== true

      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesFeatured
    })
  }, [projects, searchQuery, categoryFilter, typeFilter, statusFilter, featuredFilter])

  // Bulk actions handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProjects.map((p) => p._id || p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      return toast('No projects selected.')
    }

    if (!window.confirm(`Delete ${selectedIds.length} selected projects?`)) {
      return
    }

    setIsDeletingBulk(true)
    try {
      await Promise.all(selectedIds.map((id) => apiService.deleteProject(id)))
      toast.success(`${selectedIds.length} projects deleted.`)
      await loadProjects()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete some projects.')
      await loadProjects()
    } finally {
      setIsDeletingBulk(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) {
      return
    }

    try {
      await apiService.deleteProject(id)
      toast.success('Project deleted.')
      await loadProjects()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete project.')
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setTypeFilter('all')
    setStatusFilter('all')
    setFeaturedFilter('all')
    toast.success('Filters cleared.')
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingId(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (project) => {
    setModalMode('edit')
    setEditingId(project._id || project.id)

    let legacyCategory = project.projectCategory || 'Personal'
    let legacyType = project.projectType || 'Full Stack'

    if (legacyType === 'Personal' || legacyType === 'Client') {
      legacyCategory = legacyType
      legacyType = 'Full Stack'
    }

    setForm({
      projectName: project.projectName || '',
      description: project.description || '',
      projectCategory: legacyCategory,
      projectType: legacyType,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      clientName: project.clientName || '',
      clientCity: project.clientCity || '',
      featured: project.featured || false,
      status: project.status || 'Completed',
      order: project.order || 0,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      desktopImage: null,
      mobileImage: null,
      clientLogo: null,
      currentDesktopImage: project.desktopImage?.url || '',
      currentMobileImage: project.mobileImage?.url || '',
      currentClientLogo: project.clientLogo?.url || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (field, e) => {
    const file = e.target.files?.[0] || null
    setForm((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const handleRemoveFile = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: null,
    }))
  }

  const handleStatusChange = async (project, newStatus) => {
    const id = project._id || project.id
    try {
      const formData = new FormData()
      formData.append('status', newStatus)

      await apiService.updateProject(id, formData)
      toast.success('Project status updated.')
      await loadProjects()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    }
  }

  const handleFeaturedToggle = async (project, isFeatured) => {
    const id = project._id || project.id
    try {
      const formData = new FormData()
      formData.append('featured', isFeatured ? 'true' : 'false')

      await apiService.updateProject(id, formData)
      toast.success(isFeatured ? 'Project marked as Featured.' : 'Project removed from Featured.')
      await loadProjects()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update featured status.')
    }
  }

  const handleOrderChange = async (project, newOrder) => {
    const id = project._id || project.id
    try {
      const formData = new FormData()
      formData.append('order', newOrder)

      await apiService.updateProject(id, formData)
      toast.success('Project order updated.')
      await loadProjects()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update order.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.projectName.trim()) {
      toast.error('Project name is required.')
      return
    }
    if (!form.description.trim()) {
      toast.error('Description is required.')
      return
    }
    if (!form.projectCategory) {
      toast.error('Project category is required.')
      return
    }
    if (!form.projectType) {
      toast.error('Project type is required.')
      return
    }
    if (modalMode === 'create') {
      if (!form.desktopImage) {
        toast.error('Desktop preview image is required.')
        return
      }
      if (!form.mobileImage) {
        toast.error('Mobile preview image is required.')
        return
      }
    } else {
      if (!form.currentDesktopImage && !form.desktopImage) {
        toast.error('Desktop preview image is required.')
        return
      }
      if (!form.currentMobileImage && !form.mobileImage) {
        toast.error('Mobile preview image is required.')
        return
      }
    }

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('projectName', form.projectName.trim())
      formData.append('description', form.description.trim())
      formData.append('projectCategory', form.projectCategory)
      formData.append('projectType', form.projectType)
      formData.append('liveUrl', form.liveUrl)
      formData.append('githubUrl', form.githubUrl)
      formData.append('clientName', form.clientName)
      formData.append('clientCity', form.clientCity)
      formData.append('featured', form.featured)
      formData.append('status', form.status)
      formData.append('order', form.order)
      formData.append('technologies', form.technologies)

      if (form.desktopImage) formData.append('desktopImage', form.desktopImage)
      if (form.mobileImage) formData.append('mobileImage', form.mobileImage)
      if (form.clientLogo) formData.append('clientLogo', form.clientLogo)

      if (modalMode === 'edit' && !form.currentClientLogo && !form.clientLogo) {
        formData.append('removeClientLogo', 'true')
      }

      if (modalMode === 'create') {
        await apiService.createProject(formData)
        toast.success('Project created successfully.')
      } else {
        await apiService.updateProject(editingId, formData)
        toast.success('Project updated successfully.')
      }

      closeModal()
      await loadProjects()
    } catch (err) {
      console.error(err)
      const backendErrors = err.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        toast.error(backendErrors[0])
      } else {
        toast.error(err.response?.data?.message || 'Failed to save project.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Manage Projects</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Create, update, and manage your portfolio projects.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:opacity-90 shrink-0"
        >
          <FiPlus className="h-4 w-4" />
          Add Project
        </button>
      </header>

      {/* Main Section */}
      <section className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Search */}
            <div className="relative max-w-xs w-full flex-1 min-w-[200px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiSearch className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Filters */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Client">Client</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hidden sm:block"
            >
              <option value="all">All Types</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="ERP">ERP</option>
              <option value="Mobile App">Mobile App</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Featured</option>
              <option value="featured">Featured Only</option>
              <option value="standard">Standard Only</option>
            </select>

            {/* Clear Filters Button */}
            {(searchQuery || categoryFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || featuredFilter !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <FiX className="h-3.5 w-3.5 text-slate-400" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Bulk action */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                disabled={isDeletingBulk}
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-rose-100"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
                {isDeletingBulk ? 'Deleting...' : `Delete ${selectedIds.length} selected`}
              </button>
            </div>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto bg-white">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      checked={filteredProjects.length > 0 && selectedIds.length === filteredProjects.length}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Sr. No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-center w-24">Order</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Visuals</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Project Details</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Type & Category</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    Loading projects...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => {
                  const id = project._id || project.id
                  const isSelected = selectedIds.includes(id)

                  return (
                    <tr key={id} className={`transition-colors hover:bg-slate-50/50 ${isSelected ? 'bg-sky-50/30' : ''}`}>
                      <td className="whitespace-nowrap px-4 py-4">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleSelectRow(id)}
                          />
                        </label>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="number"
                          className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold text-slate-700 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 mx-auto block"
                          defaultValue={project.order || 0}
                          onBlur={(e) => {
                            if (e.target.value !== String(project.order || 0)) {
                              handleOrderChange(project, Number(e.target.value))
                            }
                          }}
                        />
                      </td>
                      
                      {/* Visuals */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative h-12 w-20 overflow-hidden rounded border border-slate-200 bg-slate-50">
                            {project.desktopImage?.url ? (
                              <img
                                src={project.desktopImage.url}
                                alt="Desktop"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[8px] text-slate-400 font-bold bg-slate-100">
                                No Img
                              </div>
                            )}
                          </div>
                          {project.featured && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50" title="Featured Project">
                              <FiStar className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Project Details */}
                      <td className="px-4 py-4 min-w-[200px] max-w-[300px]">
                        <div className="font-bold text-slate-900">{project.projectName}</div>
                        {project.clientName && (
                          <div className="text-xs font-bold text-indigo-600 mt-0.5">
                            Client: {project.clientName}
                          </div>
                        )}
                        <p className="text-xs text-slate-500 truncate mt-0.5" title={project.description}>
                          {project.description}
                        </p>
                      </td>
                      
                      {/* Type & Category */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="font-bold text-slate-700">{project.projectType}</div>
                        <div className="text-xs font-bold text-sky-600 mt-0.5">{project.projectCategory}</div>
                      </td>
                      
                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="relative inline-block w-32">
                          <select
                            value={project.status || 'Completed'}
                            onChange={(e) => handleStatusChange(project, e.target.value)}
                            className={`w-full appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-[10px] font-bold uppercase tracking-wider outline-none transition-all ring-1 focus:ring-2 focus:ring-sky-500 ${
                              project.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100'
                                : 'bg-orange-50 text-orange-600 ring-orange-200 hover:bg-orange-100'
                            }`}
                          >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className={`h-3 w-3 ${project.status === 'Completed' ? 'text-emerald-500' : 'text-orange-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <label className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            <input
                              type="checkbox"
                              checked={project.featured}
                              onChange={(e) => handleFeaturedToggle(project, e.target.checked)}
                              className="h-3 w-3 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                            />
                            Featured
                          </label>
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/projects/${id}`)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 text-slate-500 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:ring-emerald-200"
                            title="View Project"
                          >
                            <FiExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(project)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600 hover:ring-sky-200"
                            title="Edit"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 hover:ring-rose-200"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <FiFolder className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'create' ? 'Add Project Portfolio' : 'Edit Project Details'}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {modalMode === 'create'
                      ? 'Populate project variables and upload mockups.'
                      : 'Update project properties or change associated mockups.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-white p-2 text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-slate-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Project Name <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="projectName"
                    value={form.projectName}
                    placeholder="Enter project name..."
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Project Category <span className="text-red-500">*</span></span>
                  <select
                    name="projectCategory"
                    value={form.projectCategory}
                    onChange={handleChange}
                    className="mt-1.5 block w-full cursor-pointer rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Client">Client</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Project Type <span className="text-red-500">*</span></span>
                  <select
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    className="mt-1.5 block w-full cursor-pointer rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="ERP">ERP</option>
                    <option value="CRM">CRM</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Technologies <span className="text-slate-400 font-medium">(comma-separated)</span></span>
                  <input
                    type="text"
                    name="technologies"
                    value={form.technologies}
                    placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Live URL</span>
                  <input
                    type="url"
                    name="liveUrl"
                    value={form.liveUrl}
                    placeholder="https://..."
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">GitHub URL</span>
                  <input
                    type="url"
                    name="githubUrl"
                    value={form.githubUrl}
                    placeholder="https://github.com/..."
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Client Name <span className="text-slate-400 font-medium">(optional)</span></span>
                  <input
                    type="text"
                    name="clientName"
                    value={form.clientName}
                    placeholder="e.g. Acme Corp"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block sm:col-span-3">
                  <span className="text-xs font-bold text-slate-700">Description <span className="text-red-500">*</span></span>
                  <textarea
                    name="description"
                    rows="3"
                    value={form.description}
                    placeholder="Summarize key details about this project..."
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600 resize-none custom-scrollbar"
                  />
                </label>
                
                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="mt-1.5 block w-full cursor-pointer rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Order</span>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <div className="pt-6">
                  <label className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:border-slate-300 cursor-pointer transition-all w-full h-[38px] mt-1.5">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 outline-none"
                    />
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <FiStar className={`h-4 w-4 ${form.featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      Featured Project
                    </span>
                  </label>
                </div>
              </div>

              {/* Image Upload zones */}
              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800">Project Visual Assets</h3>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Desktop Image Box */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Desktop View <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
                      {form.desktopImage ? (
                        <div className="relative flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(form.desktopImage)}
                            alt="Desktop preview"
                            className="h-20 w-24 object-cover rounded shadow border border-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('desktopImage')}
                            className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                          >
                            <FiX className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ) : form.currentDesktopImage ? (
                        <div className="relative flex flex-col items-center">
                          <img
                            src={form.currentDesktopImage}
                            alt="Current desktop"
                            className="h-20 w-24 object-cover rounded shadow border border-white"
                          />
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, currentDesktopImage: '' }))}
                            className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                            title="Remove Current Image"
                          >
                            <FiX className="h-2.5 w-2.5" />
                          </button>
                          <span className="absolute -bottom-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Current</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 p-2 text-center">
                          <span className="text-[10px] font-bold text-slate-400">Desktop Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('desktopImage', e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button type="button" className="w-full rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
                        {form.desktopImage || form.currentDesktopImage ? 'Replace Image' : 'Upload Image'}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Image Box */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Mobile View <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
                      {form.mobileImage ? (
                        <div className="relative flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(form.mobileImage)}
                            alt="Mobile preview"
                            className="h-20 w-11 object-cover rounded shadow border border-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('mobileImage')}
                            className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                          >
                            <FiX className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ) : form.currentMobileImage ? (
                        <div className="relative flex flex-col items-center">
                          <img
                            src={form.currentMobileImage}
                            alt="Current mobile"
                            className="h-20 w-11 object-cover rounded shadow border border-white"
                          />
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, currentMobileImage: '' }))}
                            className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                            title="Remove Current Image"
                          >
                            <FiX className="h-2.5 w-2.5" />
                          </button>
                          <span className="absolute -bottom-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Current</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 p-2 text-center">
                          <span className="text-[10px] font-bold text-slate-400">Mobile Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('mobileImage', e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button type="button" className="w-full rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
                        {form.mobileImage || form.currentMobileImage ? 'Replace Image' : 'Upload Image'}
                      </button>
                    </div>
                  </div>

                  {/* Client Logo Image Box */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Client Logo <span className="font-medium normal-case text-slate-400">(optional)</span>
                    </label>
                    <div className="relative flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
                      {form.clientLogo ? (
                        <div className="relative flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(form.clientLogo)}
                            alt="Logo preview"
                            className="h-16 w-16 object-cover rounded-full shadow border-2 border-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('clientLogo')}
                            className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                          >
                            <FiX className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ) : form.currentClientLogo ? (
                        <div className="relative flex flex-col items-center">
                          <img
                            src={form.currentClientLogo}
                            alt="Current logo"
                            className="h-16 w-16 object-cover rounded-full shadow border-2 border-white"
                          />
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, currentClientLogo: '' }))}
                            className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                            title="Remove Current Image"
                          >
                            <FiX className="h-2.5 w-2.5" />
                          </button>
                          <span className="absolute -bottom-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Current</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 p-2 text-center">
                          <span className="text-[10px] font-bold text-slate-400">Client Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('clientLogo', e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button type="button" className="w-full rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
                        {form.clientLogo || form.currentClientLogo ? 'Replace Image' : 'Upload Image'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action buttons */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-700 ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:shadow-lg transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
