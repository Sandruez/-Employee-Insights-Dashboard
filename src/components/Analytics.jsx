import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BarChart from './BarChart';
import CityMap from './CityMap';

function Analytics() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditImage, setAuditImage] = useState(null);
  const [allAuditImages, setAllAuditImages] = useState([]);
  const [salaryData, setSalaryData] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load employee data
        const employeeData = await fetchEmployees();
        setEmployees(employeeData);
        
        // Calculate salary distribution by city
        const citySalaries = {};
        employeeData.forEach(emp => {
          if (!citySalaries[emp.city]) {
            citySalaries[emp.city] = { total: 0, count: 0 };
          }
          citySalaries[emp.city].total += emp.salary;
          citySalaries[emp.city].count += 1;
        });
        
        // Calculate average for each city
        const salaryDistribution = Object.entries(citySalaries).map(([city, data]) => ({
          city,
          amount: Math.round(data.total / data.count),
          count: data.count
        })).sort((a, b) => b.amount - a.amount);
        
        setSalaryData(salaryDistribution);
        
        // Get most recent audit image
        const latestAuditKey = localStorage.getItem('latest_audit');
        if (latestAuditKey) {
          const latestAuditImage = localStorage.getItem(latestAuditKey);
          setAuditImage(latestAuditImage);
          console.log('Loaded latest audit image:', latestAuditKey);
        } else {
          // Fallback: get any audit image
          const keys = Object.keys(localStorage);
          const auditKeys = keys.filter(key => key.startsWith('audit_'));
          if (auditKeys.length > 0) {
            const latestKey = auditKeys[auditKeys.length - 1];
            setAuditImage(localStorage.getItem(latestKey));
            console.log('Loaded fallback audit image:', latestKey);
          }
        }
        
        // Get employee audit mappings
        const employeeAuditMapping = JSON.parse(localStorage.getItem('employee_audit_mapping') || '{}');
        const mappedAuditImages = [];
        
        // Get audit images with employee information
        Object.keys(employeeAuditMapping).forEach(employeeId => {
          const auditInfo = employeeAuditMapping[employeeId];
          const auditImageData = localStorage.getItem(auditInfo.auditKey);
          if (auditImageData) {
            const employee = employeeData.find(emp => emp.id === parseInt(employeeId));
            mappedAuditImages.push({
              employeeId,
              employeeName: employee ? employee.name : `Employee ${employeeId}`,
              employeeDepartment: employee ? employee.department : 'Unknown',
              employeeCity: employee ? employee.city : 'Unknown',
              auditKey: auditInfo.auditKey,
              galleryKey: auditInfo.galleryKey,
              data: auditImageData,
              timestamp: auditInfo.timestamp
            });
          }
        });
        
        setAllAuditImages(mappedAuditImages.sort((a, b) => b.timestamp - a.timestamp));
        console.log('Loaded mapped audit images:', mappedAuditImages.length);
        
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.name || 'User'}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-900 mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Employee Analytics</h1>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Cities</h3>
              <p className="text-2xl font-bold text-gray-900">{new Set(employees.map(emp => emp.city)).size}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Avg Salary</h3>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Departments</h3>
              <p className="text-2xl font-bold text-gray-900">{new Set(employees.map(emp => emp.department)).size}</p>
            </div>
          </div>

          {/* Audit Image Section */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Employee Audit Records ({allAuditImages.length})</h2>
              <p className="text-sm text-gray-500">Identity verification records mapped to employees</p>
            </div>
            <div className="px-6 py-4">
              {allAuditImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allAuditImages.map((audit) => (
                    <div key={audit.employeeId} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src={audit.data} 
                        alt={`${audit.employeeName} audit record`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-900">{audit.employeeName}</h4>
                        <p className="text-sm text-gray-600">ID: {audit.employeeId}</p>
                        <p className="text-sm text-gray-600">{audit.employeeDepartment}</p>
                        <p className="text-sm text-gray-600">{audit.employeeCity}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(audit.timestamp).toLocaleString()}
                        </p>
                        <button
                          onClick={() => navigate(`/details/${audit.employeeId}`)}
                          className="mt-2 text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        >
                          View Employee
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No audit records found. Complete employee verification to see records here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Salary Distribution by City</h2>
              <p className="text-sm text-gray-500">Average salary per location</p>
            </div>
            <div className="px-6 py-4">
              <BarChart data={salaryData} height={400} />
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Total cities: {salaryData.length}</span>
                  <span>Highest: ${salaryData[0]?.amount.toLocaleString() || 'N/A'}</span>
                  <span>Lowest: ${salaryData[salaryData.length - 1]?.amount.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <CityMap employees={employees} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
