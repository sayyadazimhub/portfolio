import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiX, FiBookOpen } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { apiService } from '../utils/api.js'

const initialForm = {
  degree: '',
  institution: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  grade: '',
  description: '',
  status: true,
  order: 0,
}

export default function Education() {
  const [educationList, setEducationList] = useState([])
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
    loadEducation()
  }, [])

  const loadEducation = async () => {
    setLoading(true)
    setSelectedIds([])
    try {
      const response = await apiService.getEducationAdmin()
      setEducationList(response.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Unable to load education items.')
    } finally {
      setLoading(false)
    }
  }

  const filteredEducation = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return educationList.filter((item) => {
      const matchesSearch =
        !query ||
        item.degree?.toLowerCase().includes(query) ||
        item.institution?.toLowerCase().includes(query) ||
        item.fieldOfStudy?.toLowerCase().includes(query) ||
        item.grade?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.status === true) ||
        (statusFilter === 'inactive' && item.status === false)

      return matchesSearch && matchesStatus
    }).sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [educationList, searchQuery, statusFilter])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredEducation.map((item) => item._id || item.id))
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
      return toast('No education items selected.')
    }

    if (!window.confirm(`Delete ${selectedIds.length} selected item(s)?`)) {
      return
    }

    setIsDeletingBulk(true)
    try {
      await Promise.all(selectedIds.map((id) => apiService.deleteEducation(id)))
      toast.success(`${selectedIds.length} item(s) deleted.`)
      await loadEducation()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete selected items.')
      await loadEducation()
    } finally {
      setIsDeletingBulk(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) {
      return
    }

    try {
      await apiService.deleteEducation(id)
      toast.success('Education item deleted.')
      await loadEducation()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete education item.')
    }
  }

  const handleStatusChange = async (item, newStatus) => {
    try {
      const payload = {
        degree: item.degree,
        institution: item.institution,
        fieldOfStudy: item.fieldOfStudy,
        startDate: item.startDate,
        endDate: item.endDate,
        grade: item.grade,
        description: item.description,
        status: newStatus,
        order: item.order,
      }
      const id = item._id || item.id
      await apiService.updateEducation(id, payload)
      toast.success(`Education marked as ${newStatus ? 'Active' : 'Inactive'}.`)
      await loadEducation()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    }
  }

  const handleOrderChange = async (item, newOrderValue) => {
    try {
      const payload = {
        degree: item.degree,
        institution: item.institution,
        fieldOfStudy: item.fieldOfStudy,
        startDate: item.startDate,
        endDate: item.endDate,
        grade: item.grade,
        description: item.description,
        status: item.status,
        order: Number(newOrderValue),
      }
      const id = item._id || item.id
      await apiService.updateEducation(id, payload)
      toast.success('Order updated.')
      await loadEducation()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update order.')
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
      degree: item.degree || '',
      institution: item.institution || '',
      fieldOfStudy: item.fieldOfStudy || '',
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 10) : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 10) : '',
      grade: item.grade || '',
      description: item.description || '',
      status: item.status === true,
      order: item.order ?? 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.degree.trim()) return toast.error('Degree is required.')
    if (!form.institution.trim()) return toast.error('Institution is required.')
    if (!form.startDate) return toast.error('Start date is required.')

    try {
      setSaving(true)
      const payload = {
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        fieldOfStudy: form.fieldOfStudy.trim(),
        startDate: form.startDate,
        endDate: form.endDate || null,
        grade: form.grade.trim(),
        description: form.description,
        status: form.status,
        order: Number(form.order) || 0,
      }

      if (modalMode === 'create') {
        await apiService.createEducation(payload)
        toast.success('Education item created.')
      } else {
        await apiService.updateEducation(editingId, payload)
        toast.success('Education item updated.')
      }

      closeModal()
      await loadEducation()
    } catch (err) {
      console.error(err)
      const backendErrors = err.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length) {
        toast.error(backendErrors[0])
      } else {
        toast.error(err.response?.data?.message || 'Failed to save education item.')
      }
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (value) => {
    if (!value) return ''
    return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Manage Education</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Create, update, and order academic records.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:opacity-90 shrink-0"
        >
          <FiPlus className="h-4 w-4" />
          Add Education
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
                placeholder="Search education..."
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
                      checked={selectedIds.length > 0 && selectedIds.length === filteredEducation.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                  </label>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Sr. No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Degree & Field</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Institution</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Period</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Order</th>
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
              ) : filteredEducation.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    No entries found.
                  </td>
                </tr>
              ) : (
                filteredEducation.map((item, index) => {
                  const id = item._id || item.id
                  const start = item.startDate ? formatDate(item.startDate) : 'Unknown'
                  const end = item.endDate ? formatDate(item.endDate) : 'Present'
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
                        <div className="font-bold text-slate-900">{item.degree}</div>
                        <div className="text-xs font-bold text-sky-600 mt-0.5">{item.fieldOfStudy}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-700">{item.institution}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-slate-200">
                          {start} - {end}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="number"
                          defaultValue={item.order ?? 0}
                          onBlur={(e) => {
                            if (Number(e.target.value) !== item.order) {
                              handleOrderChange(item, e.target.value)
                            }
                          }}
                          className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 text-center"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="relative inline-block w-28">
                          <select
                            value={item.status ? 'active' : 'inactive'}
                            onChange={(e) => handleStatusChange(item, e.target.value === 'active')}
                            className={`w-full appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-[10px] font-bold uppercase tracking-wider outline-none transition-all ring-1 focus:ring-2 focus:ring-sky-500 ${
                              item.status 
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
                  <FiBookOpen className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'create' ? 'Add Education' : 'Edit Education'}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {modalMode === 'create' ? 'Fill out the details below to add a new academic record.' : 'Update the details for this academic record.'}
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

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Degree</span>
                  <input
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    placeholder="e.g. B.Sc. Computer Science"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Institution</span>
                  <input
                    name="institution"
                    value={form.institution}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    placeholder="e.g. University Name"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Field of Study</span>
                  <input
                    name="fieldOfStudy"
                    value={form.fieldOfStudy}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    placeholder="e.g. Software Engineering"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Grade / GPA</span>
                  <input
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    placeholder="e.g. 3.8/4.0"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Start Date</span>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">End Date</span>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600 resize-none custom-scrollbar"
                    placeholder="Brief summary of courses, awards, or achievements..."
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Sort Order</span>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Status</span>
                  <select
                    name="status"
                    value={form.status ? 'true' : 'false'}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value === 'true' }))}
                    className="mt-1.5 block w-full cursor-pointer rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  >
                    <option value="true">Active / Visible</option>
                    <option value="false">Inactive / Hidden</option>
                  </select>
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
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/30 transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Add Education' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
