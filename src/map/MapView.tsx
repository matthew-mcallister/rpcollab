import {useEffect, useRef} from 'react';
import MapCanvas from './MapCanvas';
import './MapView.css';

interface MapViewProps {
  mapCanvas: MapCanvas;
}

/**
 * React component which wraps around a MapCanvas for displaying and
 * manipulating a map.
 */
export default function MapView({mapCanvas}: MapViewProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    mapCanvas.attach(canvas.current);
    mapCanvas.renderLoop();
  }, []);

  return (
    <>
      <canvas width={1920} height={1080} ref={canvas} />
    </>
  );
}
