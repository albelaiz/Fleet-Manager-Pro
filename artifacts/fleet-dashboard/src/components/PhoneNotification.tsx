import React from "react";
import { Bell } from "lucide-react";

export function PhoneNotification() {
  return (
    <div className="w-[300px] h-[600px] bg-black rounded-[40px] border-[8px] border-zinc-800 relative overflow-hidden shadow-2xl flex flex-col mx-auto flex-shrink-0">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
        <div className="w-32 h-6 bg-zinc-800 rounded-b-[16px]"></div>
      </div>
      
      {/* Screen */}
      <div className="flex-1 bg-zinc-900 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        {/* Time */}
        <div className="relative z-10 pt-16 pb-8 text-center text-white">
          <div className="text-6xl font-light tracking-tighter">09:41</div>
          <div className="text-sm font-medium mt-1">Saturday, April 25</div>
        </div>
        
        {/* Notifications */}
        <div className="relative z-10 px-4 space-y-2">
          <div className="bg-zinc-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 text-white animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <div className="w-4 h-4 rounded bg-primary flex items-center justify-center">
                  <Bell className="w-2.5 h-2.5 text-white" />
                </div>
                <span>Fleet Manager</span>
              </div>
              <span className="text-xs text-white/50">now</span>
            </div>
            <div className="font-semibold text-sm mt-1">Insurance Expiring</div>
            <div className="text-sm text-white/80 mt-0.5 leading-snug">
              Insurance for BMW X5 (ABC-987) expires in 7 days. Tap to renew.
            </div>
          </div>
          
          <div className="bg-zinc-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 text-white opacity-60">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <div className="w-4 h-4 rounded bg-primary flex items-center justify-center">
                  <Bell className="w-2.5 h-2.5 text-white" />
                </div>
                <span>Fleet Manager</span>
              </div>
              <span className="text-xs text-white/50">2h ago</span>
            </div>
            <div className="font-semibold text-sm mt-1">Maintenance Due</div>
            <div className="text-sm text-white/80 mt-0.5 leading-snug">
              Toyota Corolla (DEF-456) needs an oil change.
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center">
          <div className="w-32 h-1 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
