import React from 'react';
import DigitalClock from '../components/DigitalClock';

export default function ClockPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">⏰ World Clock</h1>
      <p className="text-gray-600">View current time across different timezones</p>
      
      <DigitalClock />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About This Clock</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Real-time updates every second</li>
          <li>✅ Support for 10+ international timezones</li>
          <li>✅ Click on any timezone to select it</li>
          <li>✅ Shows full date and timezone name</li>
          <li>✅ Responsive design for all devices</li>
        </ul>
      </div>
    </div>
  );
}