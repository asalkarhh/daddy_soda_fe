import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, Radio, BarChart2, ReceiptText } from 'lucide-react';

interface IotNavTabsProps {
  activeTab: 'status' | 'events' | 'consumption' | 'manual-sales';
}

export const IotNavTabs: React.FC<IotNavTabsProps> = ({ activeTab }) => {
  const tabs = [
    {
      id: 'status',
      label: 'Machine Status & Telemetry',
      path: '/iot',
      icon: Cpu,
    },
    {
      id: 'events',
      label: 'IoT Events Log',
      path: '/iot/events',
      icon: Radio,
    },
    {
      id: 'consumption',
      label: 'Consumption Analytics',
      path: '/iot/consumption',
      icon: BarChart2,
    },
    {
      id: 'manual-sales',
      label: 'Manual Daily Sales',
      path: '/manual-sales',
      icon: ReceiptText,
    },
  ];

  return (
    <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto pb-px">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap ${
              isActive
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
            {tab.label}
          </NavLink>
        );
      })}
    </div>
  );
};
