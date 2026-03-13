import React, { useState, useEffect } from 'react';
import { fetchEmployees } from '../services/api';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        setError('Failed to load employee data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Dashboard</h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Employees</p>
                  <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Departments</p>
                  <p className="text-2xl font-bold text-green-900">{new Set(employees.map(emp => emp.department)).size}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Cities</p>
                  <p className="text-2xl font-bold text-purple-900">{new Set(employees.map(emp => emp.city)).size}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee List</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${employee.salary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.joinDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Rendering {employees.length} rows (this will be slow with large datasets)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
