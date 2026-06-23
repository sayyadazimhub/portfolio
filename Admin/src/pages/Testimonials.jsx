import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api.js'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiSearch, FiEye, FiPlus, FiX, FiMessageCircle } from 'react-icons/fi'

const initialForm = {
  name: '',
  role: '',
  company: '',
  linkedInUrl: '',
  message: '',
  status: 'pending',
  image: null,
  currentImage: '',
}

export default function Testimonials() {
  const navigate = useNavigate()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  
  // Search and selection
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    setLoading(true)
    setSelectedIds([])

    try {
      const response = await apiService.getTestimonials()
      setTestimonials(response.data?.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Unable to load testimonials.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTestimonials = testimonials.filter((t) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = (
      (t.name && t.name.toLowerCase().includes(query)) ||
      (t.role && t.role.toLowerCase().includes(query)) ||
      (t.company && t.company.toLowerCase().includes(query)) ||
      (t.message && t.message.toLowerCase().includes(query))
    )
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredTestimonials.map((t) => t._id || t.id))
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
    if (!window.confirm(`Delete ${selectedIds.length} selected testimonials?`)) {
      return
    }

    setIsDeletingBulk(true)

    try {
      await Promise.all(selectedIds.map((id) => apiService.deleteTestimonial(id)))
      toast.success(`${selectedIds.length} testimonials deleted.`)
      await loadTestimonials()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete some testimonials.')
      await loadTestimonials()
    } finally {
      setIsDeletingBulk(false)
    }
  }

  const handleStatusChange = async (testimonial, newStatus) => {
    try {
      const formData = new FormData()
      formData.append('name', testimonial.name || '')
      formData.append('role', testimonial.role || '')
      formData.append('company', testimonial.company || '')
      formData.append('linkedInUrl', testimonial.linkedInUrl || '')
      formData.append('message', testimonial.message || '')
      formData.append('status', newStatus)

      const id = testimonial._id || testimonial.id
      await apiService.updateTestimonial(id, formData)
      
      // Update local state optimistically
      setTestimonials(prev => prev.map(t => 
        (t._id === id || t.id === id) ? { ...t, status: newStatus } : t
      ))
      toast.success(`Status updated to ${newStatus}.`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    toast.success('Filters cleared.')
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingId(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (testimonial) => {
    setModalMode('edit')
    setEditingId(testimonial._id || testimonial.id)
    setForm({
      name: testimonial.name || '',
      role: testimonial.role || '',
      company: testimonial.company || '',
      linkedInUrl: testimonial.linkedInUrl || '',
      message: testimonial.message || '',
      status: testimonial.status || 'pending',
      image: null,
      currentImage: testimonial.image || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setForm((prev) => ({
      ...prev,
      image: file,
    }))
  }

  const buildFormData = () => {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('role', form.role)
    formData.append('company', form.company)
    formData.append('linkedInUrl', form.linkedInUrl)
    formData.append('message', form.message)
    formData.append('status', form.status)

    if (form.image) {
      formData.append('image', form.image)
    }

    return formData
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side field validation one-by-one
    if (!form.name.trim()) {
      return toast.error('Name is required.')
    }
    if (!form.role.trim()) {
      return toast.error('Role is required.')
    }
    if (!form.company.trim()) {
      return toast.error('Company is required.')
    }
    if (!form.linkedInUrl.trim()) {
      return toast.error('LinkedIn URL is required.')
    }
    if (!form.message.trim()) {
      return toast.error('Message is required.')
    }

    try {
      setSaving(true)

      const formData = buildFormData()

      if (modalMode === 'create') {
        await apiService.createTestimonial(formData)
        toast.success('Testimonial created successfully.')
      } else {
        await apiService.updateTestimonial(editingId, formData)
        toast.success('Testimonial updated successfully.')
      }

      closeModal()
      await loadTestimonials()
    } catch (err) {
      console.error(err)
      const backendErrors = err.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        toast.error(backendErrors[0])
      } else {
        toast.error(err.response?.data?.message || 'Failed to save testimonial.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) {
      return
    }

    try {
      await apiService.deleteTestimonial(id)
      toast.success('Testimonial deleted.')
      await loadTestimonials()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete testimonial.')
    }
  }

  const handleView = (id) => {
    navigate(`/testimonials/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Manage Testimonials</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Manage what clients and peers say about you.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:opacity-90 shrink-0"
        >
          <FiPlus className="h-4 w-4" />
          Add Testimonial
        </button>
      </header>

      {/* Main Section */}
      <section className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Search */}
            <div className="relative max-w-sm w-full flex-1 min-w-[200px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiSearch className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 animate-in fade-in slide-in-from-left-2 duration-300"
                title="Clear Filters"
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
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
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
                      checked={filteredTestimonials.length > 0 && selectedIds.length === filteredTestimonials.length}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Sr. No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Client Info</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Message</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    Loading testimonials...
                  </td>
                </tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((testimonial, index) => {
                  const id = testimonial._id || testimonial.id
                  const status = testimonial.status || 'pending'
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
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
                            {testimonial.image ? (
                              <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-slate-400">{testimonial.name?.charAt(0)?.toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{testimonial.name}</div>
                            <div className="text-xs font-bold text-sky-600 mt-0.5">{testimonial.role} at {testimonial.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 min-w-[250px] max-w-[350px]">
                        <div className="text-xs text-slate-600 line-clamp-2" title={testimonial.message}>
                          "{testimonial.message}"
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="relative inline-block w-28">
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(testimonial, e.target.value)}
                            className={`w-full appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-[10px] font-bold uppercase tracking-wider outline-none transition-all ring-1 focus:ring-2 focus:ring-sky-500 ${
                              status === 'approved' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100' :
                              status === 'rejected' ? 'bg-rose-50 text-rose-600 ring-rose-200 hover:bg-rose-100' :
                              'bg-amber-50 text-amber-600 ring-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className={`h-3 w-3 ${
                              status === 'approved' ? 'text-emerald-500' :
                              status === 'rejected' ? 'text-rose-400' :
                              'text-amber-400'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleView(id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 text-slate-500 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:ring-emerald-200"
                            title="View Testimonial"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(testimonial)}
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
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <FiMessageCircle className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'create' ? 'Add Testimonial' : 'Edit Testimonial'}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {modalMode === 'create'
                      ? 'Upload a new testimonial and image.'
                      : 'Update fields or replace the image.'}
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Name <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    placeholder="John Doe"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Role <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    placeholder="CEO"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Company <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    placeholder="Acme Corp"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">LinkedIn URL <span className="text-red-500">*</span></span>
                  <input
                    type="url"
                    name="linkedInUrl"
                    value={form.linkedInUrl}
                    placeholder="https://linkedin.com/in/..."
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Message <span className="text-red-500">*</span></span>
                  <textarea
                    name="message"
                    rows="4"
                    value={form.message}
                    placeholder="Enter the testimonial message..."
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600 resize-none custom-scrollbar"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="mt-1.5 block w-full cursor-pointer rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>
              </div>

              {/* Image Upload section */}
              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800">Profile Image</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
                    {form.image ? (
                      <div className="relative flex flex-col items-center">
                        <img
                          src={URL.createObjectURL(form.image)}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded-full shadow border-2 border-white"
                        />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, image: null }))}
                          className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                        >
                          <FiX className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ) : form.currentImage ? (
                      <div className="relative flex flex-col items-center">
                        <img
                          src={form.currentImage}
                          alt="Current"
                          className="h-20 w-20 object-cover rounded-full shadow border-2 border-white"
                        />
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, currentImage: '' }))}
                          className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600 transition"
                          title="Remove Current Image"
                        >
                          <FiX className="h-2.5 w-2.5" />
                        </button>
                        <span className="absolute -bottom-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Current</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 p-2 text-center">
                        <span className="text-[10px] font-bold text-slate-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="relative flex flex-col justify-end">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button type="button" className="w-full rounded-lg bg-slate-100 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 transition text-center border border-slate-200 h-full flex items-center justify-center">
                      {form.image || form.currentImage ? 'Replace Image' : 'Upload Image'}
                    </button>
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
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Create Testimonial' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
