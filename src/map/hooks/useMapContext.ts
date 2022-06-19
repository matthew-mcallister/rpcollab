import {createContext, useContext} from 'react';
import MapCanvas from '../MapCanvas';

interface MapContextProps {
  map: MapCanvas;
  importMap: (newMap: any) => void;
  invalidate: () => void;
}

export const MapContext = createContext<MapContextProps>(null);

export default function useMapContext(): MapContextProps {
  return useContext(MapContext);
}
