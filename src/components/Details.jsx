import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CameraCapture from './CameraCapture';
import SignatureCanvas from './SignatureCanvas';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [mergedImage, setMergedImage] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePhotoCapture = (imageData) => {
    setCapturedPhoto(imageData);
  };

  const handleSignatureChange = (signatureData) => {
    setSignature(signatureData);
  };

  const mergePhotoAndSignature = () => {
    if (!capturedPhoto || !signature) {
      return;
    }
    
    // Create image elements from data URLs
    const photoImg = new Image();
    const signatureImg = new Image();
    
    photoImg.onload = () => {
      signatureImg.onload = () => {
        // Create final canvas
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        
        // Set canvas dimensions to match photo
        finalCanvas.width = photoImg.width;
        finalCanvas.height = photoImg.height;
        
        // Draw photo first
        ctx.drawImage(photoImg, 0, 0);
        
        // Draw signature on top with transparency
        ctx.globalAlpha = 0.8; // Semi-transparent signature
        ctx.drawImage(signatureImg, 0, 0, finalCanvas.width, finalCanvas.height);
        
        // Convert to blob and then to data URL
        finalCanvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const mergedDataUrl = reader.result;
            setMergedImage(mergedDataUrl);
            
            // Store merged image for analytics page
            localStorage.setItem(`audit_${id}`, mergedDataUrl);
          };
          reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.9);
      };
      
      signatureImg.src = signature;
    };
    
    photoImg.src = capturedPhoto;
  };

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeById(id);
        if (data) {
          setEmployee(data);
        } else {
          setError('Employee not found');
        }
      } catch (err) {
        setError('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEmployee();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Employee not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
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
              <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
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
          </div>

          {/* Employee Info Card */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
              <p className="text-sm text-gray-500">ID: {employee.id}</p>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium text-gray-900">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-lg font-medium text-gray-900">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-lg font-medium text-gray-900">{employee.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="text-lg font-medium text-gray-900">${employee.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-lg font-medium text-gray-900">{employee.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Section */}
          <CameraCapture onPhotoCapture={handlePhotoCapture} />
          
          {/* Signature Section */}
          <SignatureCanvas onSignatureChange={handleSignatureChange} disabled={!capturedPhoto} />
          
          {/* Merge Section */}
          {capturedPhoto && signature && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Merge Verification</h2>
                <p className="text-sm text-gray-500">Combine photo and signature for audit record</p>
              </div>
              <div className="px-6 py-4">
                <button
                  onClick={mergePhotoAndSignature}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  🔄 Merge Photo & Signature
                </button>
              </div>
            </div>
          )}
          
          {/* Merged Image Display */}
          {mergedImage && (
            <div className="bg-white shadow rounded-lg mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">✅ Verification Complete</h2>
                <p className="text-sm text-gray-500">Audit record created successfully</p>
              </div>
              <div className="px-6 py-4">
                <img 
                  src={mergedImage} 
                  alt="Merged verification" 
                  className="w-full rounded-lg border border-gray-300"
                  style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/analytics')}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    View Analytics →
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {capturedPhoto && !signature && (
            <div className="bg-white shadow rounded-lg mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Captured Photo</h2>
                <p className="text-sm text-gray-500">Photo captured successfully</p>
              </div>
              <div className="px-6 py-4">
                <img 
                  src={capturedPhoto} 
                  alt="Captured" 
                  className="w-full rounded-lg border border-gray-300"
                  style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  Waiting for signature...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;
