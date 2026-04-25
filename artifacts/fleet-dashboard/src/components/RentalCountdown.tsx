import React, { useState, useEffect } from "react";
import { format, differenceInMinutes } from "date-fns";
import { Clock } from "lucide-react";

export function RentalCountdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const end = new Date(endDate);
    
    const update = () => {
      const now = new Date("2026-04-25T12:00:00Z"); // Using mock current date
      const mins = differenceInMinutes(end, now);
      
      if (mins <= 0) {
        setTimeLeft("Overdue");
        return;
      }
      
      const d = Math.floor(mins / 1440);
      const h = Math.floor((mins % 1440) / 60);
      const m = mins % 60;
      
      if (d > 0) {
        setTimeLeft(`${d}d ${h}h`);
      } else {
        setTimeLeft(`${h}h ${m}m`);
      }
    };
    
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20">
      <Clock className="w-3 h-3" />
      <span>Returns in {timeLeft}</span>
    </div>
  );
}
