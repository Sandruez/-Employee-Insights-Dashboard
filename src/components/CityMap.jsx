import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function CityMap({ employees }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Map city names to coordinates (approximate)
    const cityCoordinates = {
      'New York': [40.7128, -74.0060],
      'Los Angeles': [34.0522, -118.2437],
      'Chicago': [41.8781, -87.6298],
      'Houston': [29.7604, -95.3698],
      'Phoenix': [33.4484, -112.0740],
      'Philadelphia': [39.9526, -75.1652],
      'San Antonio': [29.4241, -98.4936],
      'San Diego': [32.7157, -117.1611],
      'Dallas': [32.7767, -96.7970],
      'San Jose': [37.3382, -121.8863]
    };

    // Group employees by city and calculate coordinates
    const cityData = {};
    employees.forEach(emp => {
      if (!cityData[emp.city]) {
        cityData[emp.city] = {
          city: emp.city,
          coordinates: cityCoordinates[emp.city] || [40.7128, -74.0060], // Default to NYC if city not found
          employees: [],
          totalSalary: 0
        };
      }
      cityData[emp.city].employees.push(emp);
      cityData[emp.city].totalSalary += emp.salary;
    });

    const cityArray = Object.values(cityData).map(city => ({
      ...city,
      avgSalary: Math.round(city.totalSalary / city.employees.length),
      employeeCount: city.employees.length
    }));

    setCities(cityArray);
  }, [employees]);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Employee Locations</h2>
        <p className="text-sm text-gray-500">Geographic distribution of employees</p>
      </div>
      <div className="px-6 py-4">
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer
            center={[39.8283, -98.5795]} // Center of US
            zoom={4}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {cities.map((city, index) => (
              <Marker
                key={`${city.city}-${index}`}
                position={city.coordinates}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{city.city}</h3>
                    <p className="text-sm text-gray-600">
                      {city.employeeCount} employees
                    </p>
                    <p className="text-sm text-gray-600">
                      Avg salary: ${city.avgSalary.toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Showing {cities.length} cities with {employees.length} total employees</p>
          <p>Map powered by OpenStreetMap</p>
        </div>
      </div>
    </div>
  );
}

export default CityMap;
