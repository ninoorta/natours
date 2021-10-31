export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoibmlub29ydGEiLCJhIjoiY2t2NmluYjFxMDJyNDJ3bWdiOG1mc3NkdSJ9.-fJbN_y9_WC7z9nZPjRAWA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ninoorta/ckv6jlinq7om014o3x391mhia',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create marker
    const el = document.createElement('div');
    el.className = ' marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
