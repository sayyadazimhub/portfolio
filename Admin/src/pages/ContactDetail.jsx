import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api.js'
import toast from 'react-hot-toast'
import {
  FaArrowLeft,
  FaEnvelope,
  FaEnvelopeOpen,
  FaQuoteLeft,
  FaCalendarAlt,
  FaDatabase,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaReply
} from 'react-icons/fa'

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadContact()
  }, [id])

  const loadContact = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiService.getContacts()
      const foundContact = response.data?.data?.find(c => (c._id || c.id) === id)
      if (!foundContact) {
        setError('Contact not found.')
        return
      }
      setContact(foundContact)
    } catch (err) {
      console.error(err)
      setError('Unable to load contact details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
          <p className="text-slate-500 font-medium text-sm animate-pulse">Loading message details...</p>
        </div>
      </div>
    )
  }

  if (error || !contact) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/contact')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <FaArrowLeft /> Back to Contacts
        </button>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700 shadow-sm flex items-center gap-3">
          <FaTimesCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{error || 'Contact not found.'}</span>
        </div>
      </div>
    )
  }

  const status = contact.status || 'pending'

  // Determine status color scheme
  const getStatusConfig = (status) => {
    switch (status) {
      case 'replied':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <FaReply className="text-indigo-500" />,
          label: 'Replied'
        }
      case 'read':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <FaCheckCircle className="text-emerald-500" />,
          label: 'Read'
        }
      default:
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: <FaClock className="text-sky-500" />,
          label: 'Unread'
        }
    }
  }

  const statusConfig = getStatusConfig(status)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/contact')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <FaArrowLeft /> Back to List
        </button>

        <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${statusConfig.bg}`}>
          {statusConfig.icon}
          {statusConfig.label}
        </span>
      </div>

      {/* Main Profile Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">

        {/* Cover Banner */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900">
          {/* Decorative shapes */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-300 via-slate-900 to-sky-900"></div>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl"></div>
        </div>

        {/* Profile Header (Avatar and Title overlapping banner) */}
        <div className="relative px-6 sm:px-8 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 sm:-mt-20">
            {/* Avatar */}
            <div className="h-32 w-32 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-sky-600 to-indigo-500 text-white font-bold text-4xl shadow-inner">
                {contact.name?.charAt(0) || '?'}
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1 mb-2 sm:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{contact.name}</h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-slate-600 text-sm sm:text-base font-medium">
                <span className="flex items-center gap-1.5">
                  <FaEnvelope className="text-slate-400 shrink-0" />
                  {contact.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Left Column: Contact and Meta details */}
            <div className="space-y-6 lg:col-span-1 lg:border-r lg:border-slate-100 lg:pr-8">

              {/* Direct Action */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Reply</h3>
                <div className="mt-3">
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 hover:text-sky-800"
                    >
                      <FaEnvelopeOpen className="h-5 w-5 shrink-0 text-sky-600" />
                      Send Email Reply
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">No email address provided</span>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Information</h3>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <FaDatabase className="mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Inquiry Message ID</p>
                      <p className="font-mono text-xs text-slate-800 select-all">{contact._id || contact.id}</p>
                    </div>
                  </div>

                  {contact.createdAt && (
                    <div className="flex items-start gap-2.5">
                      <FaCalendarAlt className="mt-0.5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Received On</p>
                        <p className="text-slate-800 font-medium">
                          {new Date(contact.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Inquiry Message Card */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</h3>
              <p className="relative z-10 text-slate-700 text-base sm:text-lg font-semibold leading-relaxed whitespace-pre-wrap">
                {contact.subject || 'No Subject'}
              </p>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submitted Message</h3>
              <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8 shadow-inner overflow-hidden">
                <FaQuoteLeft className="absolute -right-4 -top-4 h-24 w-24 text-sky-100/40 select-none pointer-events-none transform rotate-180" />

                <p className="relative z-10 text-slate-700 text-base sm:text-lg italic leading-relaxed whitespace-pre-wrap font-serif">
                  "{contact.message}"
                </p>
              </div>


              {/* Status information notice */}
              {status === 'pending' && (
                <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-xs sm:text-sm text-sky-800">
                  <p className="font-semibold">✉️ Unread Message</p>
                  <p className="mt-1 text-sky-700">This message is currently marked as unread. Go to the main contact listing to update its status or reply.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
