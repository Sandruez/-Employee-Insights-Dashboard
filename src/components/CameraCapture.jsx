import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const CameraCapture = forwardRef(({ onPhotoCapture }, ref) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera failed: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    
    if (onPhotoCapture) {
      onPhotoCapture(imageData);
    }
  };

  useImperativeHandle(ref, () => ({
    stopCamera
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Camera</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <video
          ref={videoRef}
          autoPlay
          className="w-full max-w-md mx-auto border rounded"
          style={{ display: isStreaming ? 'block' : 'none' }}
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="flex justify-center space-x-4">
          {!isStreaming ? (
            <button
              onClick={startCamera}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Start Camera
            </button>
          ) : (
            <>
              <button
                onClick={takePicture}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Take Photo
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Stop Camera
              </button>
            </>
          )}
        </div>
        
        {capturedImage && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Captured Photo:</h3>
            <img src={capturedImage} alt="Captured" className="w-full max-w-xs mx-auto border rounded" />
          </div>
        )}
      </div>
    </div>
  );
});

export default CameraCapture;
