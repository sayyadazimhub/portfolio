import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiX, FiFolder, FiExternalLink, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { apiService } from '../utils/api.js'

const initialForm = {
  title: 'Resume',
  status: true,
  resumePdf: null,
}

export default function Resume() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Bulk Selection States
  const [selectedIds, setSelectedIds] = useState([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    setLoading(true)
    setSelectedIds([])
    try {
      const response = await apiService.getResumeAdmin()
      setResumes(response.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Unable to load resume entries.')
    } finally {
      setLoading(false)
    }
  }

  const filteredResumes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return resumes.filter((item) => {
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.resumeUrl?.toLowerCase().includes(query) ||
        item.resumePublicId?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.status === true) ||
        (statusFilter === 'inactive' && item.status === false)

      return matchesSearch && matchesStatus
    })
  }, [resumes, searchQuery, statusFilter])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredResumes.map((item) => item._id || item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      return toast('No resume items selected.')
    }

    if (!window.confirm(`Delete ${selectedIds.length} selected item(s)?`)) {
      return
    }

    setIsDeletingBulk(true)
    try {
      await Promise.all(selectedIds.map((id) => apiService.deleteResume(id)))
      toast.success(`${selectedIds.length} item(s) deleted.`)
      await loadResumes()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete selected resume items.')
      await loadResumes()
    } finally {
      setIsDeletingBulk(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume entry?')) {
      return
    }

    try {
      await apiService.deleteResume(id)
      toast.success('Resume entry deleted.')
      await loadResumes()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete resume entry.')
    }
  }

  const handleStatusChange = async (item, newValue) => {
    const id = item._id || item.id
    const newStatus = newValue === 'active'
    try {
      const formData = new FormData()
      formData.append('status', newStatus)

      await apiService.updateResume(id, formData)
      toast.success(`Resume marked ${newStatus ? 'active' : 'inactive'}.`)
      await loadResumes()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingId(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setModalMode('edit')
    setEditingId(item._id || item.id)
    setForm({
      title: item.title || 'Resume',
      status: item.status === true,
      resumePdf: null,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    toast.success('Filters cleared.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (modalMode === 'create' && !form.resumePdf) {
      return toast.error('Resume PDF file is required.')
    }

    try {
      setSaving(true)
      
      const formData = new FormData()
      formData.append('title', form.title.trim() || 'Resume')
      formData.append('status', form.status)
      if (form.resumePdf) {
        formData.append('resumePdf', form.resumePdf)
      }

      if (modalMode === 'create') {
        await apiService.createResume(formData)
        toast.success('Resume created successfully.')
      } else {
        await apiService.updateResume(editingId, formData)
        toast.success('Resume updated successfully.')
      }

      closeModal()
      await loadResumes()
    } catch (err) {
      console.error(err)
      const backendErrors = err.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length) {
        toast.error(backendErrors[0])
      } else {
        toast.error(err.response?.data?.message || 'Failed to save resume entry.')
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Manage Resume</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Create, update, and publish your resume download links.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:opacity-90 shrink-0"
        >
          <FiPlus className="h-4 w-4" />
          Add Resume
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
                placeholder="Search resumes..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Clear Filters Button */}
            {(searchQuery || statusFilter !== 'all') && (
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
                      checked={filteredResumes.length > 0 && selectedIds.length === filteredResumes.length}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Sr. No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Title</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Preview</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Public ID</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    Loading resume entries...
                  </td>
                </tr>
              ) : filteredResumes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    No resume entries found.
                  </td>
                </tr>
              ) : (
                filteredResumes.map((item, index) => {
                  const id = item._id || item.id
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
                      <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900">
                        {item.title}
                      </td>
                      <td className="px-4 py-4">
                        <a 
                          href={item.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block h-28 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition hover:shadow-md relative group"
                          title="Click to view full PDF"
                        >
                          {item.resumeUrl ? (
                            <>
                              <img 
                                src={item.resumeUrl.replace(/\.pdf$/, '.jpg')} 
                                alt="Resume Thumbnail"
                                className="h-full w-full object-cover object-top"
                              />
                              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                                <FiExternalLink className="text-slate-800 opacity-0 group-hover:opacity-100 h-5 w-5 drop-shadow-sm transition-opacity" />
                              </div>
                            </>
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-slate-400 font-bold p-2 text-center">No PDF</div>
                          )}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-slate-500">
                        {item.resumePublicId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="relative inline-block w-28">
                          <select
                            value={item.status ? 'active' : 'inactive'}
                            onChange={(e) => handleStatusChange(item, e.target.value)}
                            className={`w-full appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-[10px] font-bold uppercase tracking-wider outline-none transition-all ring-1 focus:ring-2 focus:ring-sky-500 ${
                              item.status
                                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className={`h-3 w-3 ${item.status ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <FiFileText className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'create' ? 'Add Resume' : 'Edit Resume'}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {modalMode === 'create'
                      ? 'Upload a new PDF resume document.'
                      : 'Update resume details or upload a new PDF.'}
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
              <div className="grid gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Title <span className="text-red-500">*</span></span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    placeholder="e.g. Resume 2026"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Resume PDF File {modalMode === 'create' && <span className="text-red-500">*</span>}</span>
                  <div className="relative mt-1.5 flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition group cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      name="resumePdf"
                      accept=".pdf"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center text-slate-500 pointer-events-none">
                      <FiFileText className="h-6 w-6 text-slate-400 group-hover:text-sky-500 transition" />
                      <span className="mt-2 text-xs font-bold">{form.resumePdf ? form.resumePdf.name : 'Click to Upload PDF'}</span>
                    </div>
                  </div>
                  {modalMode === 'edit' && (
                    <p className="mt-2 text-[10px] font-bold text-slate-400">Leave empty to keep the existing PDF file.</p>
                  )}
                </label>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:border-slate-300 cursor-pointer transition-all w-full">
                    <input
                      type="checkbox"
                      name="status"
                      checked={form.status}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 outline-none"
                    />
                    <span className="text-xs font-bold">Active Status</span>
                  </label>
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
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Upload Resume' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
