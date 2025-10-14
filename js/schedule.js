// Schedule-related functionality
const ScheduleManager = {
    selectedCourses: [],

    // Add course to schedule
    addCourse: function(course) {
        if (!this.selectedCourses.some(c => c.id === course.id)) {
            this.selectedCourses.push(course);
            return true;
        }
        return false;
    },

    // Remove course from schedule
    removeCourse: function(courseId) {
        const index = this.selectedCourses.findIndex(c => c.id === courseId);
        if (index !== -1) {
            this.selectedCourses.splice(index, 1);
            return true;
        }
        return false;
    },

    // Toggle course selection
    toggleCourse: function(course) {
        const index = this.selectedCourses.findIndex(c => c.id === course.id);
        
        if (index === -1) {
            this.selectedCourses.push(course);
            return true; // Added
        } else {
            this.selectedCourses.splice(index, 1);
            return false; // Removed
        }
    },

    // Get all selected courses
    getSelectedCourses: function() {
        return this.selectedCourses;
    },

    // Clear all selected courses
    clearSchedule: function() {
        this.selectedCourses = [];
    },

    // Check if course is selected
    isCourseSelected: function(courseId) {
        return this.selectedCourses.some(c => c.id === courseId);
    },

    // Render schedule grid
    renderSchedule: function(containerId) {
        const scheduleGrid = document.getElementById(containerId);
        scheduleGrid.innerHTML = '';
        
        const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                          '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        
        // Add empty cell for top-left corner
        scheduleGrid.appendChild(document.createElement('div'));
        
        // Add day headers
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            scheduleGrid.appendChild(dayHeader);
        });
        
        // Add time slots and schedule cells
        timeSlots.forEach(time => {
            // Add time slot
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            scheduleGrid.appendChild(timeSlot);
            
            // Add cells for each day
            days.forEach(day => {
                const cell = document.createElement('div');
                cell.className = 'schedule-cell';
                cell.dataset.day = day;
                cell.dataset.time = time;
                scheduleGrid.appendChild(cell);
            });
        });
        
        // Add class events to the schedule
        this.selectedCourses.forEach(course => {
            course.schedule.forEach(session => {
                const dayIndex = days.indexOf(session.day);
                if (dayIndex !== -1) {
                    const timeRange = session.time.split(' - ');
                    const startTime = timeRange[0];
                    
                    // Find the cell for this session
                    const cells = document.querySelectorAll('.schedule-cell');
                    const targetCell = Array.from(cells).find(cell => 
                        cell.dataset.day === session.day && 
                        cell.dataset.time === startTime
                    );
                    
                    if (targetCell) {
                        const classEvent = document.createElement('div');
                        classEvent.className = 'class-event';
                        classEvent.textContent = `${course.code} - ${session.location}`;
                        classEvent.dataset.courseId = course.id;
                        
                        // Add click event to show location on map
                        classEvent.addEventListener('click', () => {
                            // This will be handled by the main app
                            const event = new CustomEvent('classSelected', { 
                                detail: { courseId: course.id } 
                            });
                            document.dispatchEvent(event);
                        });
                        
                        targetCell.appendChild(classEvent);
                    }
                }
            });
        });
    }
};