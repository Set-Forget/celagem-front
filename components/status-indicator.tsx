import React from 'react';
import { cn } from "@/lib/utils"

type StatusIndicatorProps = {
  status: 'offline' | 'online' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  pulseColor?: string;
};

const statusColors = {
  offline: 'bg-gray-400',
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

const pulseSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  pulseColor
}) => {
  return (
    <span className="relative flex h-3 w-3 items-center justify-center">
      <span
        className={cn(
          "animate-ping absolute inline-flex rounded-full opacity-75",
          pulseSizeClasses[size],
          pulseColor || statusColors[status]
        )}
      ></span>
      <span
        className={cn(
          "relative inline-flex rounded-full",
          sizeClasses[size],
          statusColors[status]
        )}
      ></span>
    </span>
  );
};

