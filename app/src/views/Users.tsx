//import { useState } from 'react';
import { Users } from 'lucide-react';
import UserList from '../components/user/UserList';

export default function UserView() {
     return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-blue-800/40 h-[8vh] md:h-[7vh]">
       <div className="flex items-center gap-2 h-full p-4">
            <Users className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-cyan-500 uppercase">Staff</h1>
        </div>
      </div>

      <div className="max-h-[82vh] overflow-y-scroll">
        <UserList />
      </div>
    </div>
  );
}