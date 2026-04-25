import React from "react";

export function PhoneNotification() {
  return (
    <div className="w-[260px] h-[520px] bg-background rounded-[40px] border-[6px] border-muted relative overflow-hidden shadow-sm flex flex-col mx-auto flex-shrink-0 animate-in fade-in duration-500">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
        <div className="w-24 h-5 bg-muted rounded-b-xl"></div>
      </div>
      
      {/* Screen */}
      <div className="flex-1 flex flex-col relative pt-12 px-4 bg-muted/20">
        
        {/* Time */}
        <div className="text-center mb-8">
          <div className="text-4xl font-light tracking-tight text-foreground tabular-nums">09:41</div>
          <div className="text-xs font-medium text-muted-foreground mt-1">Saturday, April 25</div>
        </div>
        
        {/* Notifications */}
        <div className="space-y-3 relative z-10">
          <div className="bg-card rounded-2xl p-4 shadow-sm border text-foreground animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Fleet
              </div>
              <span className="text-[10px] text-muted-foreground">now</span>
            </div>
            <div className="font-semibold text-sm">Insurance Expiring</div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Insurance for BMW X5 (ABC-987) expires in 7 days. Tap to renew.
            </div>
          </div>
          
          <div className="bg-card rounded-2xl p-4 shadow-sm border text-foreground opacity-50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Fleet
              </div>
              <span className="text-[10px] text-muted-foreground">2h ago</span>
            </div>
            <div className="font-semibold text-sm">Maintenance Due</div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Toyota Corolla (DEF-456) needs an oil change.
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center">
          <div className="w-24 h-1 bg-foreground/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}