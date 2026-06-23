import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api.js'
import toast from 'react-hot-toast'
import { FiSearch, FiEye, FiTrash2, FiX, FiMessageSquare } from 'react-icons/fi'

export default function Contact() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Bulk action states
  const [selectedIds, setSelectedIds] = useState([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    setLoading(true)
    setSelectedIds([]) // Reset selected items
    try {
      const response = await apiService.getContacts()
      setContacts(response.data?.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Unable to load contacts.')
    } finally {
      setLoading(false)
    }
  }

  const openViewModal = (contact) => navigate(`/contact/${contact._id || contact.id}`)

  const handleStatusChange = async (contact, newStatus) => {
    const id = contact._id || contact.id
    try {
      await apiService.updateContact(id, { status: newStatus })
      setContacts((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id
            ? { ...item, status: newStatus }
            : item
        )
      )
      toast.success(`Status updated to ${newStatus}.`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this contact message?')
    if (!confirmed) return

    try {
      await apiService.deleteContact(id)
      toast.success('Message deleted.')
      await loadContacts()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete message.')
    }
  }

  // Bulk actions handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredContacts.map((c) => c._id || c.id))
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
    if (!window.confirm(`Delete ${selectedIds.length} selected messages?`)) {
      return
    }

    setIsDeletingBulk(true)

    try {
      await Promise.all(selectedIds.map((id) => apiService.deleteContact(id)))
      toast.success(`${selectedIds.length} messages deleted.`)
      await loadContacts()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete some messages.')
      await loadContacts() // Refresh list to see what succeeded
    } finally {
      setIsDeletingBulk(false)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    toast.success('Filters cleared.')
  }

  const filteredContacts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return contacts
      .filter((contact) => {
        const status = contact.status || 'pending'

        if (statusFilter === 'unread' && status !== 'pending') return false
        if (statusFilter === 'read' && status !== 'read' && status !== 'replied') return false
        if (statusFilter === 'replied' && status !== 'replied') return false

        if (!term) return true

        const name = contact.name?.toLowerCase() || ''
        const email = contact.email?.toLowerCase() || ''
        const message = contact.message?.toLowerCase() || ''
        const subject = contact.subject?.toLowerCase() || ''
        return (
          name.includes(term) ||
          email.includes(term) ||
          message.includes(term) ||
          subject.includes(term)
        )
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [contacts, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Contact Messages</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Read and manage incoming feedback and inquiries.</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 border border-slate-100">
          <FiMessageSquare className="h-4 w-4 text-sky-500" />
          <span className="text-xs font-bold text-slate-700">
            Total: {contacts.length} message{contacts.length !== 1 ? 's' : ''}
          </span>
        </div>
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
                placeholder="Search by name, email, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>

            {(searchTerm || statusFilter !== 'all') && (
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
                      checked={filteredContacts.length > 0 && selectedIds.length === filteredContacts.length}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Sr. No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Sender Info</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Message Overview</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Received On</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    Loading messages...
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-sm font-medium text-slate-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact, index) => {
                  const id = contact._id || contact.id
                  const status = contact.status || 'pending'
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
                        <div className="font-bold text-slate-900">{contact.name}</div>
                        <div className="text-xs font-bold text-sky-600 mt-0.5">{contact.email}</div>
                      </td>
                      <td className="px-4 py-4 min-w-[250px] max-w-[350px]">
                        <div className="font-bold text-slate-800 line-clamp-1" title={contact.subject || 'No Subject'}>
                          {contact.subject || 'No Subject'}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5" title={contact.message}>
                          {contact.message}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-slate-200">
                          {contact.createdAt
                            ? new Date(contact.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="relative inline-block w-28">
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(contact, e.target.value)}
                            className={`w-full appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-[10px] font-bold uppercase tracking-wider outline-none transition-all ring-1 focus:ring-2 focus:ring-sky-500 ${
                              status === 'replied' ? 'bg-indigo-50 text-indigo-600 ring-indigo-200 hover:bg-indigo-100' :
                              status === 'read' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100' :
                              'bg-sky-50 text-sky-600 ring-sky-200 hover:bg-sky-100'
                            }`}
                          >
                            <option value="pending">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className={`h-3 w-3 ${
                              status === 'replied' ? 'text-indigo-400' :
                              status === 'read' ? 'text-emerald-400' :
                              'text-sky-400'
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
                            onClick={() => openViewModal(contact)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600 hover:ring-sky-200"
                            title="View Message"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 hover:ring-rose-200"
                            title="Delete Message"
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
    </div>
  )
}