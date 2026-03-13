# Employee Insights Dashboard

A comprehensive React application demonstrating modern web development practices including authentication, virtual scrolling, camera integration, and data visualization.

## Features

- **Authentication System**: Login/logout with localStorage persistence
- **Protected Routing**: Route guards with redirect handling
- **Virtual Scrolling**: High-performance table rendering for 10,000+ rows
- **Camera Integration**: Photo capture and digital signature
- **Data Visualization**: Custom SVG charts and interactive maps
- **Analytics Dashboard**: Employee insights and audit records

## Architecture

### Frontend Stack
- React 18 with hooks
- React Router v6 for navigation
- Tailwind CSS for styling
- Leaflet for mapping
- Canvas API for image processing

### Key Components

#### Authentication Flow
- `Login.jsx` - Login form with validation
- `AuthContext.jsx` - Global auth state management
- `ProtectedRoute.jsx` - Route protection wrapper

#### Virtual Scrolling System
- `VirtualizedList.jsx` - Custom virtual list implementation
- Performance optimization for large datasets
- Buffer rows and throttled scroll handling

#### Camera & Identity Verification
- `CameraCapture.jsx` - WebRTC camera access
- `SignatureCanvas.jsx` - Touch/mouse drawing
- Canvas merging with alpha blending

#### Data Visualization
- `BarChart.jsx` - Custom SVG chart component
- `CityMap.jsx` - Interactive map with markers
- `Analytics.jsx` - Dashboard with insights

## Known Issues

### ⚠️ Stale Closure Bug in Virtual Scrolling

**Location**: `src/components/VirtualizedList.jsx:45`

**Description**: The scroll handler uses a stale closure over the `data` array due to missing dependency in useEffect.

```javascript
// BUG: Missing 'data' in dependency array
useEffect(() => {
  const container = containerRef.current;
  if (container) {
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }
}, []); // Should include 'data'
```

**Impact**: When employee data updates, the virtual scroll handler still references the old data array, causing incorrect row rendering.

**Fix**: Add 'data' to the dependency array or use useCallback for the scroll handler.

**Why Intentional**: This demonstrates a common React bug pattern that developers encounter with stale closures.

## Virtual Scrolling Implementation

### Core Concepts

The virtual scrolling system renders only visible rows to handle large datasets efficiently:

1. **Viewport Calculation**: Determine visible range based on scroll position
2. **Buffer Rows**: Extra rows above/below to prevent flashing
3. **CSS Transform**: Position rows for optimal performance
4. **Throttled Scrolling**: 60fps scroll performance

### Performance Metrics

- **Before Virtualization**: 10,000 DOM elements ~2-3s render time
- **After Virtualization**: ~20 DOM elements ~100ms render time
- **Memory Usage**: Reduced by ~95%

## Development Workflow

This project follows an incremental development approach with 30 commits:

### Phase 1: Foundation (Commits 1-5)
- React setup with routing and Tailwind CSS
- Login page layout and validation
- Auth context and localStorage

### Phase 2: Protected Routing (Commits 6-8)
- Protected route component
- Redirect loop fixes
- Auth persistence across refreshes

### Phase 3: Data Grid (Commits 9-12)
- API service with mock data
- Basic table rendering
- Performance issue identification

### Phase 4: Virtual Scrolling (Commits 13-18)
- Virtual list component
- Core math and scrollbar fixes
- Buffer rows and transform positioning
- Scroll handler optimization

### Phase 5: Camera Integration (Commits 19-23)
- Details page routing
- Camera access and photo capture
- Signature canvas
- Image merging with alpha blending

### Phase 6: Data Visualization (Commits 24-27)
- Analytics page with audit images
- Salary distribution calculations
- Custom SVG bar chart
- Interactive city map

### Phase 7: Documentation (Commits 28-30)
- Intentional bug demonstration
- README documentation
- Final cleanup

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## Usage

1. **Login**: Use any credentials (demo authentication)
2. **Dashboard**: View employee data with virtual scrolling
3. **Details**: Click "View" on any employee to see details
4. **Verification**: Capture photo and signature for identity verification
5. **Analytics**: View merged audit records and data insights

## Technical Highlights

### Virtual Scrolling Algorithm

```javascript
// Calculate visible range
const visibleStart = Math.floor(scrollTop / ROW_HEIGHT);
const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);
const visibleEnd = visibleStart + visibleCount;

// Add buffer for smooth scrolling
const bufferedStart = Math.max(0, visibleStart - BUFFER_SIZE);
const bufferedEnd = Math.min(data.length, visibleEnd + BUFFER_SIZE);
```

### Canvas Image Processing

```javascript
// Merge photo and signature
ctx.drawImage(photoImg, 0, 0);
ctx.globalAlpha = 0.8;
ctx.drawImage(signatureImg, 0, 0, width, height);
```

### Custom Chart Rendering

```javascript
// SVG bar chart without external libraries
const barHeight = (item.amount / maxSalary) * chartHeight;
return (
  <rect
    x={x}
    y={chartHeight - barHeight}
    width={barWidth}
    height={barHeight}
    fill={barColor}
  />
);
```

## Performance Optimizations

- **Virtual Scrolling**: Render only visible rows
- **Throttled Events**: 60fps scroll handling
- **CSS Transforms**: GPU-accelerated positioning
- **Canvas Optimization**: Efficient image processing
- **Memoization**: Prevent unnecessary re-renders

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this as a learning resource.

## Contributing

This is a demonstration project. For production use, consider:
- Fixing the intentional stale closure bug
- Adding proper error boundaries
- Implementing proper API integration
- Adding unit and integration tests
