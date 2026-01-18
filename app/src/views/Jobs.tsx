//import { useState } from 'react';
import { WashingMachine } from 'lucide-react';

function JobsPlaceholder() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Laundry Jobs</h2>
      <p className="text-gray-500">Laundry jobs will be managed here in the future.</p>
    </div>
  );
}

export default function Jobs() {
     return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-blue-800/40 p-4">
       <div className="flex items-center gap-2 ">
            <WashingMachine className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-cyan-500 uppercase">Jobs</h1>
        </div>
      </div>

      <div className="p-4">
        <JobsPlaceholder />
      </div>
    </div>
  );
}