import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api.js'
import { 
  FaArrowLeft, 
  FaLinkedin, 
  FaQuoteLeft, 
  FaBriefcase, 
  FaBuilding, 
  FaCalendarAlt, 
  FaDatabase,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa'

export default function TestimonialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [testimonial, setTestimonial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTestimonial()
  }, [id])

  const loadTestimonial = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiService.getTestimonialById(id)
      setTestimonial(response.data?.data || null)
    } catch (err) {
      console.error(err)
      setError('Unable to load testimonial details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
          <p className="text-slate-500 font-medium text-sm animate-pulse">Loading profile details...</p>
        </div>
      </div>
    )
  }

  if (error || !testimonial) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/testimonials')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <FaArrowLeft /> Back to Testimonials
        </button>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700 shadow-sm flex items-center gap-3">
          <FaTimesCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{error || 'Testimonial not found.'}</span>
        </div>
      </div>
    )
  }

  // Determine status color scheme
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <FaCheckCircle className="text-emerald-500" />,
          label: 'Approved'
        }
      case 'rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <FaTimesCircle className="text-rose-500" />,
          label: 'Rejected'
        }
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <FaClock className="text-amber-500" />,
          label: 'Pending Approval'
        }
    }
  }

  const statusConfig = getStatusConfig(testimonial.status)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/testimonials')}
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
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
          {/* Decorative shapes */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-300 via-slate-900 to-indigo-900"></div>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl"></div>
        </div>

        {/* Profile Header (Avatar and Title overlapping banner) */}
        <div className="relative px-6 sm:px-8 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 sm:-mt-20">
            {/* Avatar */}
            <div className="h-32 w-32 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl">
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-4xl shadow-inner">
                  {testimonial.name?.charAt(0) || '?'}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-1 mb-2 sm:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{testimonial.name}</h1>
              
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-slate-600 text-sm sm:text-base font-medium">
                <span className="flex items-center gap-1.5">
                  <FaBriefcase className="text-slate-400 shrink-0" />
                  Role: {testimonial.role}
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <FaBuilding className="text-slate-400 shrink-0" />
                  Company: {testimonial.company}
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
              
              {/* Professional Profile */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Link</h3>
                <div className="mt-3">
                  {testimonial.linkedInUrl ? (
                    <a
                      href={testimonial.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 hover:text-blue-800"
                    >
                      <FaLinkedin className="h-5 w-5 shrink-0 text-blue-600" />
                      View LinkedIn Profile
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">No LinkedIn profile provided</span>
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
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Testimonial ID</p>
                      <p className="font-mono text-xs text-slate-800 select-all">{testimonial._id || testimonial.id}</p>
                    </div>
                  </div>

                  {testimonial.createdAt && (
                    <div className="flex items-start gap-2.5">
                      <FaCalendarAlt className="mt-0.5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Submitted On</p>
                        <p className="text-slate-800 font-medium">
                          {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {testimonial.updatedAt && testimonial.updatedAt !== testimonial.createdAt && (
                    <div className="flex items-start gap-2.5">
                      <FaCalendarAlt className="mt-0.5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Last Updated</p>
                        <p className="text-slate-800 font-medium">
                          {new Date(testimonial.updatedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Recommendation / Quote Card */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommendation / Feedback</h3>
              
              <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8 shadow-inner overflow-hidden">
                <FaQuoteLeft className="absolute -right-4 -top-4 h-24 w-24 text-indigo-100/40 select-none pointer-events-none transform rotate-180" />
                
                <p className="relative z-10 text-slate-700 text-base sm:text-lg italic leading-relaxed whitespace-pre-wrap font-serif">
                  "{testimonial.message}"
                </p>
              </div>

              {/* Prompt to take action if pending */}
              {testimonial.status === 'pending' && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs sm:text-sm text-amber-800">
                  <p className="font-semibold">⚠️ Pending Approval</p>
                  <p className="mt-1 text-amber-700">This testimonial is currently pending approval. Go back to the testimonial dashboard to approve or reject this submission to control its public visibility.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
