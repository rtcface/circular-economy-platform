import { useEffect, useState } from 'react';

export function MapPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamically import to avoid SSR window is not defined error
    import('./LeafletMap').then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center rounded">
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  return <MapComponent onLocationSelect={onLocationSelect} />;
}
