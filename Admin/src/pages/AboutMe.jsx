import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiTrash2, FiUser, FiUploadCloud, FiX, FiSearch, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { apiService } from '../utils/api.js'

const initialForm = {
  fullName: '',
  title: '',
  bio: '',
  status: true,
  profileImage: null,
  existingImage: null,
}

export default function AboutMe() {
  const [aboutMes, setAboutMes] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)

  useEffect(() => {
    loadAboutMes()
  }, [])

  const loadAboutMes = async () => {
    setLoading(true)
    setSelectedIds([])
    try {
      const response = await apiService.getAboutMeAdmin()
      setAboutMes(response.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Unable to load about me entries.')
    } finally {
      setLoading(false)
    }
  }

  const filteredAboutMes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return aboutMes.filter((item) => {
      const matchesSearch =
        !query ||
        item.fullName?.toLowerCase().includes(query) ||
        item.title?.toLowerCase().includes(query) ||
        item.bio?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.status === true) ||
        (statusFilter === 'inactive' && item.status === false)

      return matchesSearch && matchesStatus
    })
  }, [aboutMes, searchQuery, statusFilter])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredAboutMes.map((item) => item._id || item.id))
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
      return toast('No items selected.')
    }

    if (!window.confirm(`Delete ${selectedIds.length} selected item(s)?`)) {
      return
    }

    setIsDeletingBulk(true)
    try {
      await Promise.all(selectedIds.map((id) => apiService.deleteAboutMe(id)))
      toast.success(`${selectedIds.length} item(s) deleted.`)
      await loadAboutMes()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete selected items.')
      await loadAboutMes()
    } finally {
      setIsDeletingBulk(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this about me entry?')) {
      return
    }

    try {
      await apiService.deleteAboutMe(id)
      toast.success('About me entry deleted.')
      await loadAboutMes()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete about me entry.')
    }
  }

  const handleStatusChange = async (item, newStatus) => {
    try {
      const formData = new FormData()
      formData.append('fullName', item.fullName)
      formData.append('title', item.title)
      formData.append('bio', item.bio)
      formData.append('status', newStatus)

      const id = item._id || item.id
      await apiService.updateAboutMe(id, formData)
      toast.success(`Profile marked as ${newStatus ? 'Active' : 'Inactive'}.`)
      await loadAboutMes()
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
      fullName: item.fullName || '',
      title: item.title || '',
      bio: item.bio || '',
      status: item.status === true,
      profileImage: null,
      existingImage: item.profileImage || null,
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.fullName.trim() || !form.title.trim() || !form.bio.trim()) {
      return toast.error('Full Name, Title, and Bio are required.')
    }

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('fullName', form.fullName.trim())
      formData.append('title', form.title.trim())
      formData.append('bio', form.bio.trim())
      formData.append('status', form.status)
      if (form.profileImage) {
        formData.append('profileImage', form.profileImage)
      }

      if (modalMode === 'create') {
        await apiService.createAboutMe(formData)
        toast.success('About Me created successfully.')
      } else {
        await apiService.updateAboutMe(editingId, formData)
        toast.success('About Me updated successfully.')
      }

      closeModal()
      await loadAboutMes()
    } catch (err) {
      console.error(err)
      const backendErrors = err.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length) {
        toast.error(backendErrors[0])
      } else {
        toast.error(err.response?.data?.message || 'Failed to save about me entry.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 mt-2 sm:mt-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Manage About Me</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Create and update your about me sections.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:shadow-lg transition-all duration-300 hover:opacity-90 shrink-0"
        >
          <FiPlus className="h-4 w-4" />
          Add About Me
        </button>
      </header>

      <section className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-2.5 flex-1 items-stretch sm:items-center">
            <div className="relative max-w-xs w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiSearch className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search profiles..."
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  toast.success('Filters cleared.')
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <FiX className="h-3.5 w-3.5 text-slate-400" />
                Clear Filters
              </button>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 mt-2 lg:mt-0">
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

        <div className="overflow-x-auto bg-white border-t border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredAboutMes.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                  </label>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Sr. No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Image</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Full Name</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Title</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Bio</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    Loading entries...
                  </td>
                </tr>
              ) : filteredAboutMes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    No entries found.
                  </td>
                </tr>
              ) : (
                filteredAboutMes.map((item, index) => {
                  const id = item._id || item.id
                  return (
                    <tr key={id} className="transition-colors hover:bg-slate-50/50">
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(id)}
                          onChange={() => handleSelectRow(id)}
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-500">
                        {String(index + 1).padStart(1, '0')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {item.profileImage ? (
                          <img src={item.profileImage} alt={item.fullName} className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-slate-100" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center ring-1 ring-slate-100 shadow-sm">
                            <FiUser className="h-5 w-5 text-slate-300" />
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900">{item.fullName}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-bold text-sky-600">{item.title}</td>
                      <td className="px-4 py-4 text-slate-500 max-w-xs truncate">{item.bio}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="relative inline-block w-28">
                          <select
                            value={item.status ? 'active' : 'inactive'}
                            onChange={(e) => handleStatusChange(item, e.target.value === 'active')}
                            className={`w-full appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-[10px] font-bold uppercase tracking-wider outline-none transition-all ring-1 focus:ring-2 focus:ring-sky-500 ${item.status
                                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100'
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <FiUser className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'create' ? 'Add New Profile' : 'Edit Profile'}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {modalMode === 'create' ? 'Fill out the details below to create a new profile entry.' : 'Update the details for this profile.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-slate-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Full Name</span>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    placeholder="e.g. John Doe"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Title / Role</span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    placeholder="e.g. Senior Frontend Engineer"
                    required
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Biography</span>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600 resize-none custom-scrollbar"
                    placeholder="Write a brief professional summary about yourself..."
                    required
                  />
                </label>

                <div className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Profile Image</span>
                  <div className="mt-1.5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="shrink-0 relative">
                      {form.profileImage ? (
                        <img src={URL.createObjectURL(form.profileImage)} alt="Preview" className="h-14 w-14 rounded-xl object-cover shadow-sm ring-1 ring-slate-200" />
                      ) : form.existingImage ? (
                        <img src={form.existingImage} alt="Current" className="h-14 w-14 rounded-xl object-cover shadow-sm ring-1 ring-slate-200" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200 shadow-sm">
                          <FiUser className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                      {form.profileImage && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <label className="flex w-full cursor-pointer appearance-none items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs transition-all hover:border-sky-400 hover:bg-sky-50">
                        <div className="flex flex-col items-center space-y-1">
                          <FiUploadCloud className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-500 text-center">
                            Drop image to upload, or <span className="text-sky-600 underline">browse</span>
                          </span>
                          {modalMode === 'edit' && (
                            <span className="text-xs text-slate-400">Leave empty to keep current image</span>
                          )}
                        </div>
                        <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="hidden" />
                      </label>
                      {form.profileImage && (
                        <p className="mt-2 text-xs font-medium text-emerald-600 truncate max-w-xs">
                          {form.profileImage.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900">Status</h4>                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" name="status" checked={form.status} onChange={handleChange} className="peer sr-only" />
                  <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-100"></div>
                </label>
              </div>

              {/* Footer Actions */}
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
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Create Profile' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
