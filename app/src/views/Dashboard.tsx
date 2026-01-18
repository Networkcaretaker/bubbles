//import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';

function DashboardPlaceholder() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Dashboard</h2>
      <p className="text-gray-500">General dashboard widgets will be managed here in the future.</p>
    </div>
  );
}

export default function Dashboard() {
     return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-blue-800/40 p-4">
       <div className="flex items-center gap-2 ">
            <LayoutDashboard className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-cyan-500 uppercase">Dashboard</h1>
        </div>
      </div>

      <div className="p-4">
        <DashboardPlaceholder />
      </div>
    </div>
  );
}