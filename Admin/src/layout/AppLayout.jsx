import React from 'react'
import Sidebar from '../components/common/Sidebar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-24 sm:p-6 sm:pt-28 md:p-8 md:pt-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-sm shadow-slate-200 sm:p-8 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
