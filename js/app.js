// Main application
const App = {
    init: function() {
        this.showLoading();
        
        // Initialize courses and schedule
        CourseManager.init();
        ScheduleManager.loadFromStorage();
        
        // Setup the application
        this.initializeFilters();
        this.setupEventListeners();
        this.renderCourseList();
        this.renderSchedule();
        
        this.hideLoading();
        
        console.log('Application initialized successfully');
    },

    initializeFilters: function() {
        const departmentFilter = document.getElementById('department');
        const departments = CourseManager.getDepartments();
        
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentFilter.appendChild(option);
        });
    },

    renderCourseList: function() {
        const department = document.getElementById('department').value;
        const level = document.getElementById('level').value;
        const search = document.getElementById('search').value;
        
        const filteredCourses = CourseManager.filterCourses(department, level, search);
        const courseList = document.getElementById('courseList');
        
        courseList.innerHTML = '';
        
        if (filteredCourses.length === 0) {
            courseList.innerHTML = `
                <div class="no-courses">
                    <p>No courses found.</p>
                    <p>Try different filters.</p>
                </div>
            `;
            return;
        }
        
        filteredCourses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-item';
            
            if (ScheduleManager.isCourseSelected(course.id)) {
                courseElement.classList.add('selected');
            }
            
            const hasLab = CourseManager.getRelatedSections(course.id).some(s => s.type === 'lab');
            
            courseElement.innerHTML = `
                <div class="course-code">${course.code}</div>
                <div class="course-name">${course.name}</div>
                <div class="course-meta">${course.instructor} • ${course.credits} credits</div>
                ${hasLab ? '<div class="course-meta">Includes lab</div>' : ''}
                <div class="course-details">
                    <span>${course.schedule[0].day} ${course.schedule[0].time}</span>
                    <span>${course.seats.available}/${course.seats.total} seats</span>
                </div>
            `;
            
            courseElement.addEventListener('click', () => {
                ScheduleManager.toggleCourse(course);
                this.renderCourseList();
                this.renderSchedule();
            });
            
            courseList.appendChild(courseElement);
        });
    },

    renderSchedule: function() {
        ScheduleManager.renderSchedule('scheduleGrid');
    },

    setupEventListeners: function() {
        document.getElementById('department').addEventListener('change', () => this.renderCourseList());
        document.getElementById('level').addEventListener('change', () => this.renderCourseList());
        document.getElementById('search').addEventListener('input', () => this.renderCourseList());
        
        document.getElementById('saveSchedule').addEventListener('click', () => this.saveSchedule());
        document.getElementById('clearSchedule').addEventListener('click', () => this.clearSchedule());
    },

    saveSchedule: function() {
        const selectedCourses = ScheduleManager.getSelectedCourses();
        if (selectedCourses.length === 0) {
            alert('No courses to save!');
            return;
        }
        
        const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
        alert(`Schedule saved! ${selectedCourses.length} courses, ${totalCredits} credits.`);
    },

    clearSchedule: function() {
        ScheduleManager.clearSchedule();
        this.renderCourseList();
        this.renderSchedule();
        alert('Schedule cleared!');
    },

    showLoading: function() {
        const courseList = document.getElementById('courseList');
        if (courseList) {
            courseList.innerHTML = `
                <div class="loading">
                    <p>Loading courses...</p>
                </div>
            `;
        }
    },

    hideLoading: function() {
        // Handled by renderCourseList
    }
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});