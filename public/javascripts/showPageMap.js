mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: playground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

let marker = new mapboxgl.Marker({ color: 'red', draggable: true })
    .setLngLat(playground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${playground.title}</h3><p>${playground.location}</p>`
        )
    )
    .addTo(map);
