// Map-related functionality
const MapManager = {
    map: null,
    markers: [],

    // Initialize the map
    init: function() {
        this.map = L.map('map').setView([40.7589, -73.9851], 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.addCampusBuildings();
    },

    // Add campus buildings as markers
    addCampusBuildings: function() {
        const campusBuildings = [
            { name: "Science Building", lat: 40.7589, lng: -73.9851 },
            { name: "Math Building", lat: 40.7580, lng: -73.9845 },
            { name: "Physics Building", lat: 40.7575, lng: -73.9855 },
            { name: "Computer Science Building", lat: 40.7595, lng: -73.9840 },
            { name: "Engineering Building", lat: 40.7585, lng: -73.9835 }
        ];

        campusBuildings.forEach(building => {
            const marker = L.marker([building.lat, building.lng])
                .addTo(this.map)
                .bindPopup(building.name);
            
            this.markers.push(marker);
        });
    },

    // Show class location on map
    showClassLocation: function(course) {
        // Center map on class location
        this.map.setView([course.location.lat, course.location.lng], 17);
        
        // Open popup for the course
        L.popup()
            .setLatLng([course.location.lat, course.location.lng])
            .setContent(`<strong>${course.code}</strong><br>${course.schedule[0].location}`)
            .openOn(this.map);
    },

    // Clear all markers (if needed)
    clearMarkers: function() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }
};