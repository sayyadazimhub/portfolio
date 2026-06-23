import { useEffect, useMemo, useState } from 'react'
import { apiService } from '../utils/api.js'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiX, FiImage, FiBookOpen } from 'react-icons/fi'

const initialForm = {
  title: '',
  issuer: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  order: 0,
  status: true,
  certificateImage: null,
  currentImage: '',
}

export default function Certificates() {
  const [certificates, setCertificates] = useState([])
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
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    setLoading(true)
    setSelectedIds([])
    try {
      const response = await apiService.getCertificatesAdmin()
      setCertificates(response.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Unable to load certificates.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCertificates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return certificates.filter((item) => {
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.issuer?.toLowerCase().includes(query) ||
        item.credentialId?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.status === true) ||
        (statusFilter === 'inactive' && item.status === false)

      return matchesSearch && matchesStatus
    })
  }, [certificates, searchQuery, statusFilter])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCertificates.map((item) => item._id || item.id))
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
      await Promise.all(selectedIds.map((id) => apiService.deleteCertificate(id)))
      toast.success(`${selectedIds.length} item(s) deleted.`)
      await loadCertificates()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete selected items.')
      await loadCertificates()
    } finally {
      setIsDeletingBulk(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) {
      return
    }

    try {
      await apiService.deleteCertificate(id)
      toast.success('Certificate deleted.')
      await loadCertificates()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete certificate.')
    }
  }

  const handleStatusChange = async (item, newStatusStr) => {
    const newStatus = newStatusStr === 'true'
    const id = item._id || item.id
    try {
      const formData = new FormData()
      formData.append('status', newStatus)
      // Since it's a FormData API, we append required fields to prevent validation errors
      formData.append('title', item.title)
      formData.append('issuer', item.issuer)
      formData.append('issueDate', item.issueDate)
      
      await apiService.updateCertificate(id, formData)
      toast.success('Status updated.')
      await loadCertificates()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    }
  }

  const handleOrderChange = async (item, newOrder) => {
    const id = item._id || item.id
    try {
      const formData = new FormData()
      formData.append('order', newOrder)
      formData.append('title', item.title)
      formData.append('issuer', item.issuer)
      formData.append('issueDate', item.issueDate)

      await apiService.updateCertificate(id, formData)
      toast.success('Order updated.')
      await loadCertificates()
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
      title: item.title || '',
      issuer: item.issuer || '',
      issueDate: item.issueDate ? new Date(item.issueDate).toISOString().split('T')[0] : '',
      credentialId: item.credentialId || '',
      credentialUrl: item.credentialUrl || '',
      order: item.order || 0,
      status: item.status === true,
      certificateImage: null,
      currentImage: item.certificateImage || '', // assuming API returns this in certificateImage
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
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setForm((prev) => ({
      ...prev,
      certificateImage: file,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.issuer.trim() || !form.issueDate) {
      return toast.error('Title, Issuer, and Issue Date are required.')
    }

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('issuer', form.issuer.trim())
      formData.append('issueDate', form.issueDate)
      formData.append('credentialId', form.credentialId.trim())
      formData.append('credentialUrl', form.credentialUrl.trim())
      formData.append('order', form.order)
      formData.append('status', form.status)
      if (form.certificateImage) {
        formData.append('certificateImage', form.certificateImage)
      }

      if (modalMode === 'create') {
        await apiService.createCertificate(formData)
        toast.success('Certificate created successfully.')
      } else {
        await apiService.updateCertificate(editingId, formData)
        toast.success('Certificate updated successfully.')
      }

      closeModal()
      await loadCertificates()
    } catch (err) {
      console.error(err)
      const backendErrors = err.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length) {
        toast.error(backendErrors[0])
      } else {
        toast.error(err.response?.data?.message || 'Failed to save certificate.')
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Certificates & Credentials</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Manage your professional certifications and course diplomas.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:opacity-90 shrink-0"
        >
          <FiPlus className="h-4 w-4" />
          Add Certificate
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
                placeholder="Search certificates..."
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

            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
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
                <th className="whitespace-nowrap px-4 py-3 text-left w-4">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      checked={filteredCertificates.length > 0 && selectedIds.length === filteredCertificates.length}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center w-12">Sr. No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-center w-24">Order</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Document</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Credential Details</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Links</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    Loading certificates...
                  </td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((item, index) => {
                  const id = item._id || item.id
                  const isSelected = selectedIds.includes(id)

                  return (
                    <tr key={id} className={`transition-colors hover:bg-slate-50/50 ${isSelected ? 'bg-sky-50/30' : ''}`}>
                      <td className="whitespace-nowrap px-4 py-4 w-4">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleSelectRow(id)}
                          />
                        </label>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-center font-medium text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="number"
                          className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold text-slate-700 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 mx-auto block"
                          defaultValue={item.order || 0}
                          onBlur={(e) => {
                            if (e.target.value !== String(item.order)) {
                              handleOrderChange(item, Number(e.target.value))
                            }
                          }}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="h-10 w-16 overflow-hidden rounded border border-slate-200 bg-slate-50 flex items-center justify-center group relative">
                          {item.certificateImage ? (
                            <img src={item.certificateImage} alt={item.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <FiImage className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 min-w-[200px] max-w-[300px]">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-xs font-bold text-indigo-600 mt-0.5">{item.issuer}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Issued: {item.issueDate ? new Date(item.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {item.credentialId && (
                          <div className="text-[10px] font-mono text-slate-500 mb-1">ID: {item.credentialId}</div>
                        )}
                        {item.credentialUrl ? (
                          <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-sky-600 hover:underline">
                            View Credential &rarr;
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">No URL</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="relative inline-block w-24">
                          <select
                            value={item.status ? 'true' : 'false'}
                            onChange={(e) => handleStatusChange(item, e.target.value)}
                            className={`w-full appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-[10px] font-bold uppercase tracking-wider outline-none transition-all ring-1 focus:ring-2 focus:ring-sky-500 ${
                              item.status
                                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className={`h-3 w-3 ${item.status ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
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

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <FiBookOpen className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'create' ? 'Add Certificate' : 'Edit Certificate'}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {modalMode === 'create'
                      ? 'Upload a new credential or certificate.'
                      : 'Update your certificate details.'}
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
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-slate-700">Certificate Title <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    placeholder="E.g. AWS Certified Developer"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Issuer <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="issuer"
                    value={form.issuer}
                    placeholder="E.g. Amazon Web Services"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>
                
                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Issue Date <span className="text-red-500">*</span></span>
                  <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Credential ID</span>
                  <input
                    type="text"
                    name="credentialId"
                    value={form.credentialId}
                    placeholder="E.g. 1A2B3C4D"
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">Credential URL</span>
                  <input
                    type="url"
                    name="credentialUrl"
                    value={form.credentialUrl}
                    placeholder="https://..."
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                  />
                </label>
                
                <div className="flex gap-4 sm:col-span-2">
                  <label className="block flex-1">
                    <span className="text-xs font-bold text-slate-700">Order</span>
                    <input
                      type="number"
                      name="order"
                      value={form.order}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    />
                  </label>
                  
                  <label className="block flex-1">
                    <span className="text-xs font-bold text-slate-700">Status</span>
                    <select
                      name="status"
                      value={form.status ? 'true' : 'false'}
                      onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value === 'true' }))}
                      className="mt-1.5 block w-full cursor-pointer rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-sky-600"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Image Upload section */}
              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800">Certificate Document Image (Optional)</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
                    {form.certificateImage ? (
                      <div className="relative flex flex-col items-center">
                        <img
                          src={URL.createObjectURL(form.certificateImage)}
                          alt="Preview"
                          className="h-20 w-32 object-cover rounded shadow border border-white"
                        />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, certificateImage: null }))}
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
                          className="h-20 w-32 object-cover rounded shadow border border-white"
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
                      {form.certificateImage || form.currentImage ? 'Replace Image' : 'Upload Image'}
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
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Add Certificate' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
