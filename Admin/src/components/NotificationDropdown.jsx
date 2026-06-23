import React from 'react';

const NotificationDropdown = ({ notifications, isOpen, onClose, onMarkAsRead, onOpen }) => {
  if (!isOpen) return null;

  // Filter to show only unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 cursor-default"
        onClick={onClose}
      />

      {/* Dropdown Container */}
      <div className="absolute right-0 mt-3 w-[26rem] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
        {/* Dropdown Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base">
              Notifications
            </h3>
            {unreadNotifications.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {unreadNotifications.length} New
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition duration-150"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[30rem] overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => {
              const isTestimonial = notification.type === 'testimonial';
              
              return (
                <div
                  key={notification.id}
                  className={`relative group px-5 py-4 transition-all duration-200 bg-white hover:bg-slate-50 border-l-4 ${
                    isTestimonial ? 'border-l-indigo-500' : 'border-l-sky-500'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Notification Type Icon Badge */}
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 border ${
                      isTestimonial 
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                        : 'bg-sky-50 border-sky-100 text-sky-600'
                    }`}>
                      {isTestimonial ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Notification Body */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onOpen(notification)}
                        className="text-left w-full focus:outline-none"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-800 truncate">
                            {notification.name}
                          </span>
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isTestimonial 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                              : 'bg-sky-50 text-sky-700 border border-sky-100'
                          }`}>
                            {isTestimonial ? 'Testimonial' : 'Inquiry'}
                          </span>
                        </div>

                        {isTestimonial ? (
                          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                            {notification.role || 'Contributor'} • {notification.company || 'No Company'}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                            {notification.email}
                          </p>
                        )}

                        <p className="text-sm text-slate-600 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Timestamp */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                      </button>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="h-8 w-8 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-100 transition duration-150 shrink-0 self-center active:scale-95"
                      title="Mark as read"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white">
              <svg className="w-14 h-14 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <h4 className="text-sm font-semibold text-slate-700">All caught up!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">You have read all of your incoming notifications.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
