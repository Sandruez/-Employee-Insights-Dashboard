import React, { useState, useRef, useEffect } from 'react';

function CameraCapture({ onPhotoCapture }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser. Please use a modern browser.');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready and loaded
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error('Video play error:', err);
            setError('Failed to start video playback. Please try again.');
          });
        };
        
        videoRef.current.onerror = () => {
          setError('Video loading error. Please check camera permissions.');
        };
      }
      
      // Set camera active immediately
      setIsCameraActive(true);
      
    } catch (err) {
      let errorMessage = 'Camera access failed. ';
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera device found. Please connect a camera.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage += 'Camera does not support required settings. Try a different camera.';
      } else {
        errorMessage += err.message || 'Unknown error occurred.';
      }
      setError(errorMessage);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera not ready. Please try again.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    try {
      // Set canvas dimensions to match video or use fallback
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, width, height);
      
      // Get image data from canvas
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      
      // Pass to parent component
      if (onPhotoCapture) {
        onPhotoCapture(imageData);
      }
      
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to capture photo. Please try again.');
      console.error('Capture error:', err);
    }
  };

  const debugCamera = () => {
    if (videoRef.current) {
      console.log('Camera Debug Info:');
      console.log('- Video Width:', videoRef.current.videoWidth);
      console.log('- Video Height:', videoRef.current.videoHeight);
      console.log('- Ready State:', videoRef.current.readyState);
      console.log('- Current Time:', videoRef.current.currentTime);
      console.log('- Stream Active:', !!stream);
      console.log('- Camera Active:', isCameraActive);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Camera Capture</h2>
        <p className="text-sm text-gray-500">Take a photo for identity verification</p>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {!isCameraActive ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Start Camera
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border border-gray-300"
                style={{ maxWidth: '640px', margin: '0 auto', display: 'block' }}
              />
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                📸 Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Stop Camera
              </button>
            </div>
          </div>
        )}
        
        {/* Hidden canvas for photo capture */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
        
        {/* Show captured image */}
        {capturedImage && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Captured Photo Preview:</h3>
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full rounded-lg border border-gray-300"
              style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraCapture;
