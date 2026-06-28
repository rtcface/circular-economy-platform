import { useEffect, useState } from 'react';

export function MapPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import to avoid SSR window is not defined error
    import('./LeafletMap').then((mod) => {
      setMapComponent(() => mod.default);
    }).catch((err) => {
      console.error("Map load error", err);
      setError("Error al cargar el mapa. Verifica tu conexión a internet.");
    });
  }, []);

  if (error) {
    return <div className="h-[300px] w-full bg-red-500/10 rounded flex items-center justify-center text-red-500 font-bold text-center p-4">{error}</div>;
  }

  if (!MapComponent) {
    return (
      <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center rounded">
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  return <MapComponent onLocationSelect={onLocationSelect} />;
}
