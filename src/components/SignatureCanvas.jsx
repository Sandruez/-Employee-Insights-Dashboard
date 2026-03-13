import React, { useRef, useEffect, useState } from 'react';

function SignatureCanvas({ onSignatureChange, disabled = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 200;
    
    // Set drawing styles
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Clear canvas with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e) => {
    if (disabled) return;
    
    const coordinates = getCoordinates(e);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.beginPath();
    context.moveTo(coordinates.x, coordinates.y);
    setIsDrawing(true);
    setHasSignature(true);
    
    // Prevent scrolling when drawing on touch devices
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    
    const coordinates = getCoordinates(e);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.lineTo(coordinates.x, coordinates.y);
    context.stroke();
    
    // Prevent scrolling when drawing on touch devices
    if (e.type === 'touchmove') {
      e.preventDefault();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Get signature data and pass to parent
    const canvas = canvasRef.current;
    if (canvas && hasSignature && onSignatureChange) {
      const signatureData = canvas.toDataURL('image/png');
      onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Digital Signature</h2>
        <p className="text-sm text-gray-500">Please sign below to verify identity</p>
      </div>
      
      <div className="px-6 py-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
          <canvas
            ref={canvasRef}
            className="border border-gray-400 rounded cursor-crosshair"
            style={{ 
              touchAction: 'none', // Prevent touch scrolling on canvas
              maxWidth: '100%',
              height: 'auto'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {hasSignature ? '✓ Signature captured' : 'Draw your signature above'}
          </p>
          
          <button
            onClick={clearSignature}
            disabled={disabled || !hasSignature}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear Signature
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignatureCanvas;
