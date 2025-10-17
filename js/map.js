// Map functionality
const MapManager = {
    map: null,
    markers: [],

    init: function() {
        // Initialize courses and schedule
        CourseManager.init();
        ScheduleManager.loadFromStorage();
        
        // Create map
        this.map = L.map('map').setView([41.8075, -72.2527], 16);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add campus buildings
        this.addCampusBuildings();
        
        // Display selected courses
        this.displaySelectedCourses();
        
        // Check URL parameters
        this.checkUrlParameters();
    },

    addCampusBuildings: function() {
        const buildings = [
            { name: "ITE Building", lat: 41.8075, lng: -72.2527 },
            { name: "Math Building", lat: 41.8065, lng: -72.2532 },
            { name: "Physics Building", lat: 41.8060, lng: -72.2540 },
            { name: "Chemistry Building", lat: 41.8055, lng: -72.2535 },
            { name: "English Building", lat: 41.8080, lng: -72.2520 },
            { name: "History Building", lat: 41.8070, lng: -72.2515 },
            { name: "Psychology Building", lat: 41.8068, lng: -72.2510 },
            { name: "Art Building", lat: 41.8090, lng: -72.2530 },
            { name: "Music Building", lat: 41.8085, lng: -72.2525 }
        ];

        buildings.forEach(building => {
            L.marker([building.lat, building.lng])
                .addTo(this.map)
                .bindPopup(`<strong>${building.name}</strong>`);
        });
    },

    displaySelectedCourses: function() {
        const selectedCourses = ScheduleManager.getSelectedCourses();
        const courseList = document.getElementById('courseListMap');
        
        courseList.innerHTML = '';
        
        if (selectedCourses.length === 0) {
            courseList.innerHTML = `
                <div class="no-courses">
                    <p>No courses in schedule.</p>
                    <p>Add courses first.</p>
                </div>
            `;
            return;
        }
        
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
        
        // Add course markers and list items
        selectedCourses.forEach(course => {
            // Add marker
            const marker = L.marker([course.location.lat, course.location.lng])
                .addTo(this.map)
                .bindPopup(`
                    <strong>${course.code}: ${course.name}</strong><br>
                    ${course.schedule[0].location}<br>
                    ${course.schedule.map(s => `${s.day} ${s.time}`).join('<br>')}
                `);
            
            this.markers.push(marker);
            
            // Add to list
            const courseElement = document.createElement('div');
            courseElement.className = 'course-item';
            courseElement.innerHTML = `
                <div class="course-code">${course.code}</div>
                <div class="course-name">${course.name}</div>
                <div class="course-meta">${course.schedule[0].location}</div>
            `;
            
            courseElement.addEventListener('click', () => {
                this.map.setView([course.location.lat, course.location.lng], 17);
                marker.openPopup();
            });
            
            courseList.appendChild(courseElement);
        });
        
        // Fit map to show all markers
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    },

    checkUrlParameters: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('course');
        
        if (courseId) {
            const course = CourseManager.getCourseById(parseInt(courseId));
            if (course) {
                this.map.setView([course.location.lat, course.location.lng], 17);
            }
        }
    }
};

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', () => {
    MapManager.init();
});