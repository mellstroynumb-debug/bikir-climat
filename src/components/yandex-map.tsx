'use client';

import { useEffect, useRef } from 'react';

// This lets TypeScript know that the 'ymaps' object will be available on the window
declare global {
  interface Window {
    ymaps: any;
  }
}

interface YandexMapProps {
  center: [number, number];
  zoom: number;
}

export const YandexMap = ({ center, zoom }: YandexMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.ymaps) {
      // The 'ymaps.ready' function ensures that the Yandex Maps API is fully loaded
      window.ymaps.ready(() => {
        if (!mapRef.current) return;
        
        // This clears any previous map instance to avoid conflicts
        mapRef.current.innerHTML = '';

        // Create a new map instance
        const map = new window.ymaps.Map(mapRef.current, {
          center,
          zoom,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Create a placemark (the pin on the map)
        const placemark = new window.ymaps.Placemark(center, {}, {
            preset: 'islands#blueDotIcon'
        });

        // Add the placemark to the map
        map.geoObjects.add(placemark);

        // Make the map non-scrollable with the mouse wheel for better page navigation
        map.behaviors.disable('scrollZoom');
      });
    }
  }, [center, zoom]); // Re-run the effect if the map center or zoom level changes

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};
