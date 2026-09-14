import React from 'react';
import { StatCards } from './StatCards';
import { PriorityQueue } from './PriorityQueue';
import { ActivityFeed } from './ActivityFeed';
import { FleetQuickView } from './FleetQuickView';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-4 p-4 max-w-[1700px] mx-auto">
      {/* 1. Real-Time KPI Cards */}
      <StatCards />

      {/* 2. Priority Queue & Live Event Feed (Side by side on desktop) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7">
          <PriorityQueue />
        </div>
        <div className="xl:col-span-5">
          <ActivityFeed />
        </div>
      </div>

      {/* 3. Fleet Quick Telemetry */}
      <FleetQuickView />
    </div>
  );
};
