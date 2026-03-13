import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../services/api';
import BarChart from './BarChart';
import CityMap from './CityMap';

function Analytics() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditImage, setAuditImage] = useState(null);
  const [salaryData, setSalaryData] = useState([]);

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
        const keys = Object.keys(localStorage);
        const auditKeys = keys.filter(key => key.startsWith('audit_'));
        if (auditKeys.length > 0) {
          const latestAuditKey = auditKeys[auditKeys.length - 1];
          setAuditImage(localStorage.getItem(latestAuditKey));
        }
        
      } catch (err) {
        console.error('Analytics loading error:', err);
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
              <h2 className="text-xl font-semibold text-gray-800">Latest Audit Record</h2>
              <p className="text-sm text-gray-500">Most recent identity verification</p>
            </div>
            <div className="px-6 py-4">
              {auditImage ? (
                <img 
                  src={auditImage} 
                  alt="Audit record" 
                  className="w-full rounded-lg border border-gray-300"
                  style={{ maxWidth: '500px', margin: '0 auto', display: 'block' }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p>No audit records yet. Complete identity verification to see audit images here.</p>
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
