import {useEffect, useRef} from 'react';
import useMapContext from './hooks/useMapContext';
import './MapView.css';

interface MapViewProps {}

/**
 * React component which wraps around a MapCanvas for displaying and
 * manipulating a map.
 */
export default function MapView(props: MapViewProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useMapContext();

  useEffect(() => {
    ctx.map.attach(canvas.current);
    ctx.map.renderLoop();
  }, [ctx.map]);

  function handleResize(entries: ResizeObserverEntry[]) {
    const entry = entries[0];
    canvas.current.width = entry.contentRect.width;
    canvas.current.height = entry.contentRect.height;
  }

  useEffect(() => {
    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas.current);
  }, []);

  return (
    <>
      <canvas width={1920} height={1080} ref={canvas} />
    </>
  );
}
