// Main application controller
const App = {
    init: function() {
        // Initialize modules
        MapManager.init();
        this.setupEventListeners();
        this.renderCourseList();
        this.renderSchedule();
    },

    // Render course list based on filters
    renderCourseList: function() {
        const department = document.getElementById('department').value;
        const level = document.getElementById('level').value;
        const search = document.getElementById('search').value.toLowerCase();
        
        const filteredCourses = CourseManager.filterCourses(department, level, search);
        const courseListElement = document.getElementById('courseList');
        
        courseListElement.innerHTML = '';
        
        filteredCourses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-item';
            if (ScheduleManager.isCourseSelected(course.id)) {
                courseElement.classList.add('selected');
            }
            
            courseElement.innerHTML = `
                <div class="course-code">${course.code}</div>
                <div class="course-name">${course.name}</div>
                <div class="course-details">
                    <span>${course.credits} credits</span>
                    <span>${course.schedule[0].day} ${course.schedule[0].time}</span>
                </div>
            `;
            
            courseElement.addEventListener('click', () => {
                const wasAdded = ScheduleManager.toggleCourse(course);
                this.renderCourseList();
                this.renderSchedule();
                
                // Show location if course was added
                if (wasAdded) {
                    this.showClassOnMap(course);
                }
            });
            
            courseListElement.appendChild(courseElement);
        });
    },

    // Render schedule grid
    renderSchedule: function() {
        ScheduleManager.renderSchedule('scheduleGrid');
    },

    // Show class on map
    showClassOnMap: function(course) {
        MapManager.showClassLocation(course);
        
        // Update class info
        const classInfoElement = document.getElementById('classInfo');
        classInfoElement.innerHTML = `
            <p><strong>${course.code}: ${course.name}</strong></p>
            <p>Location: ${course.schedule[0].location}</p>
            <p>Schedule: ${course.schedule.map(s => `${s.day} ${s.time}`).join(', ')}</p>
        `;
    },

    // Set up event listeners
    setupEventListeners: function() {
        // Filter event listeners
        document.getElementById('department').addEventListener('change', () => this.renderCourseList());
        document.getElementById('level').addEventListener('change', () => this.renderCourseList());
        document.getElementById('search').addEventListener('input', () => this.renderCourseList());
        
        // Action buttons
        document.getElementById('saveSchedule').addEventListener('click', () => {
            alert('Schedule saved successfully!');
            // In a real app, this would save to a backend or localStorage
        });
        
        document.getElementById('clearSchedule').addEventListener('click', () => {
            ScheduleManager.clearSchedule();
            this.renderCourseList();
            this.renderSchedule();
            document.getElementById('classInfo').innerHTML = '<p>Select a class to view its location</p>';
        });

        // Custom event for class selection from schedule
        document.addEventListener('classSelected', (event) => {
            const course = CourseManager.getCourseById(event.detail.courseId);
            if (course) {
                this.showClassOnMap(course);
            }
        });
    }
};

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});