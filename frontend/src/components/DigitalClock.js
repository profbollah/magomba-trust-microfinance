import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState('Africa/Dar_es_Salaam');

  const timezones = [
    { name: 'Dar es Salaam (Tanzania)', value: 'Africa/Dar_es_Salaam' },
    { name: 'Nairobi (Kenya)', value: 'Africa/Nairobi' },
    { name: 'Kampala (Uganda)', value: 'Africa/Kampala' },
    { name: 'London (UK)', value: 'Europe/London' },
    { name: 'New York (USA)', value: 'America/New_York' },
    { name: 'Tokyo (Japan)', value: 'Asia/Tokyo' },
    { name: 'Dubai (UAE)', value: 'Asia/Dubai' },
    { name: 'Sydney (Australia)', value: 'Australia/Sydney' },
    { name: 'Singapore', value: 'Asia/Singapore' },
    { name: 'Hong Kong', value: 'Asia/Hong_Kong' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date, timezone) => {
    try {
      const timeString = date.toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      return timeString;
    } catch (e) {
      return 'Invalid Timezone';
    }
  };

  const getDate = (date, timezone) => {
    try {
      return date.toLocaleString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  const currentTime = formatTime(time, selectedTimezone);
  const currentDate = getDate(time, selectedTimezone);
  const timezoneName = timezones.find(tz => tz.value === selectedTimezone)?.name;

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg shadow-lg p-8 text-white">
        {/* Main Clock Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold font-mono mb-4 tracking-wider">
            {currentTime}
          </div>
          <div className="text-xl text-blue-100 mb-2">{timezoneName}</div>
          <div className="text-sm text-blue-200">{currentDate}</div>
        </div>

        {/* Timezone Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3">Select Timezone:</label>
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-blue-700 text-white border-2 border-blue-400 focus:outline-none focus:border-blue-200 cursor-pointer"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.name}
              </option>
            ))}
          </select>
        </div>

        {/* Multiple Timezones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timezones.slice(0, 6).map((tz) => (
            <div
              key={tz.value}
              className={`p-4 rounded-lg text-center transition-all ${
                selectedTimezone === tz.value
                  ? 'bg-blue-400 ring-2 ring-white'
                  : 'bg-blue-700 hover:bg-blue-600'
              } cursor-pointer`}
              onClick={() => setSelectedTimezone(tz.value)}
            >
              <div className="text-xs font-semibold text-blue-100 mb-1">{tz.name}</div>
              <div className="text-2xl font-bold font-mono">{formatTime(time, tz.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;