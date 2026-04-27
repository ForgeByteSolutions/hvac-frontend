import { useEffect, useState } from 'react';
import { CloudRain, Sun, Wind, Cloud, MapPin } from 'lucide-react';

export default function WeatherWidget({ unit = 'F', onWeatherLoaded }) {
  const [data, setData] = useState(null);
  const [locationName, setLocationName] = useState('Chicago');

  useEffect(() => {
    const fetchWeather = async (lat, lon, cityName) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const json = await res.json();
        setData(json.current_weather);
        setLocationName(cityName);
        if (onWeatherLoaded) onWeatherLoaded(json.current_weather);
      } catch (err) {
        console.error("Weather API error", err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const geo = await res.json();
            const cityName = geo.city || geo.locality || 'Current Location';
            fetchWeather(lat, lon, cityName);
          } catch {
            fetchWeather(lat, lon, 'Current Location');
          }
        },
        (error) => {
          console.warn("Geolocation denied, defaulting to Chicago.");
          fetchWeather(41.8781, -87.6298, 'Chicago');
        }
      );
    } else {
      fetchWeather(41.8781, -87.6298, 'Chicago');
    }
  }, []);

  if (!data) return <div className="p-8 bg-apple-surface/30 rounded-[2.5rem] border border-black/5 h-40 animate-pulse" />;

  const getWeatherIcon = (code) => {
    if (code <= 3) return <Sun size={48} className="text-yellow-500" />;
    if (code >= 51 && code <= 67) return <CloudRain size={48} className="text-apple-blue" />;
    return <Cloud size={48} className="text-gray-400" />;
  };

  // Convert Celsius to Fahrenheit if needed
  const displayTemp = unit === 'F'
    ? Math.round((data.temperature * 9 / 5) + 32)
    : Math.round(data.temperature);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-apple-surface/50 p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Ambient glow matching weather */}
      <div
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[60px] opacity-20 pointer-events-none"
        style={{ backgroundColor: data.weathercode <= 3 ? '#ffcc00' : '#0066cc' }}
      />

      <div>
        <p className="text-[12px] font-bold text-apple-gray uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <MapPin size={14} /> Outside Now ({locationName})
        </p>
        <div className="flex items-center gap-6">
          {getWeatherIcon(data.weathercode)}
          <div>
            <div className="text-5xl font-bold tracking-tighter text-apple-text">
              {displayTemp}°{unit}
            </div>
            <p className="text-[14px] font-semibold text-apple-gray mt-1">
              {data.weathercode <= 3 ? 'Clear / Sunny' : data.weathercode >= 51 && data.weathercode <= 67 ? 'Rainy' : 'Cloudy'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-0 pt-6 md:pt-0 md:pl-8 md:border-l border-black/10 flex flex-col gap-3 min-w-[140px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-apple-gray flex items-center gap-2"><Wind size={16} /> Wind</span>
          <span className="text-sm font-bold text-apple-text">{Math.round(data.windspeed)} mph</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-apple-gray">Status</span>
          <span className="text-sm font-bold text-green-600">Online</span>
        </div>
      </div>
    </div>
  );
}
