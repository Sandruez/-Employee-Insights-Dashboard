import React, { useState, useEffect, useRef } from 'react';

function VirtualizedList({ data, renderItem, height = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);
  const containerRef = useRef(null);

  // Constants for virtualization
  const ROW_HEIGHT = 50; // Fixed row height in pixels
  const BUFFER_SIZE = 5; // Number of extra rows to render above/below visible area
  // Buffer prevents white space when scrolling quickly by rendering extra rows

  // Calculate visible range based on scroll position
  // Core virtualization math:
  const visibleStart = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);
  const visibleEnd = visibleStart + visibleCount;

  // Add buffer to prevent white space when scrolling fast
  const bufferedStart = Math.max(0, visibleStart - BUFFER_SIZE);
  const bufferedEnd = Math.min(data.length, visibleEnd + BUFFER_SIZE);

  // Get only the visible rows to render - this is the key performance optimization
  const visibleRows = data.slice(bufferedStart, bufferedEnd);

  // Handle scroll events
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Set up scroll container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      setContainerHeight(container.clientHeight);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Calculate total height for scrollbar - this creates the proper scroll behavior
  const totalHeight = data.length * ROW_HEIGHT;

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="overflow-auto border border-gray-200 rounded-lg"
        style={{ height: `${height}px` }}
      >
        {/* Inner div to create proper scrollbar */}
        {/* This div's height creates the scrollbar - it's the total height of all rows */}
        {/* Even though we're only rendering ~20 rows, this makes it seem like we have 10,000 rows */}
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {/* Visible rows will be positioned here */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleRows.map((item, index) => {
              const actualIndex = bufferedStart + index;
              return (
                <div
                  key={item.id || actualIndex}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${ROW_HEIGHT}px`,
                    // Use transform for better performance than changing 'top' property
                    // This moves the row to its correct position in the virtual list
                    transform: `translateY(${actualIndex * ROW_HEIGHT}px)`,
                  }}
                >
                  {renderItem(item, actualIndex)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Debug info */}
      <div className="mt-2 text-xs text-gray-500">
        Rendering {visibleRows.length} of {data.length} rows (indices {bufferedStart}-{bufferedEnd - 1})
        <br />
        Buffer: {BUFFER_SIZE} rows above/below visible area prevents white flash
      </div>
    </div>
  );
}

export default VirtualizedList;
