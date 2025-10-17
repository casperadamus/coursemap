// Schedule management
const ScheduleManager = {
    selectedCourses: [],

    addCourse: function(course) {
        if (!this.isCourseSelected(course.id)) {
            this.selectedCourses.push(course);
            
            // Add related sections (labs, discussions)
            const relatedSections = CourseManager.getRelatedSections(course.id);
            relatedSections.forEach(section => {
                if (!this.isCourseSelected(section.id)) {
                    this.selectedCourses.push(section);
                }
            });
            
            this.saveToStorage();
            return true;
        }
        return false;
    },

    removeCourse: function(courseId) {
        const course = CourseManager.getCourseById(courseId);
        if (!course) return false;

        // Remove the course
        this.selectedCourses = this.selectedCourses.filter(c => c.id !== courseId);
        
        // Remove related sections if this is a lecture
        if (course.type === 'lecture') {
            const relatedSections = CourseManager.getRelatedSections(courseId);
            relatedSections.forEach(section => {
                this.selectedCourses = this.selectedCourses.filter(c => c.id !== section.id);
            });
        }
        
        this.saveToStorage();
        return true;
    },

    toggleCourse: function(course) {
        if (this.isCourseSelected(course.id)) {
            return this.removeCourse(course.id);
        } else {
            return this.addCourse(course);
        }
    },

    getSelectedCourses: function() {
        return this.selectedCourses;
    },

    clearSchedule: function() {
        this.selectedCourses = [];
        this.saveToStorage();
    },

    isCourseSelected: function(courseId) {
        return this.selectedCourses.some(c => c.id === courseId);
    },

    saveToStorage: function() {
        try {
            localStorage.setItem('universitySchedule', JSON.stringify(this.selectedCourses));
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    },

    loadFromStorage: function() {
        try {
            const saved = localStorage.getItem('universitySchedule');
            if (saved) {
                this.selectedCourses = JSON.parse(saved);
                console.log('Loaded schedule from storage:', this.selectedCourses.length);
            }
        } catch (error) {
            console.error('Error loading schedule:', error);
        }
    },

    renderSchedule: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                          '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        
        // Create grid structure
        container.appendChild(document.createElement('div')); // Empty corner
        
        // Day headers
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            container.appendChild(dayHeader);
        });
        
        // Time slots and cells
        timeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            container.appendChild(timeSlot);
            
            days.forEach(day => {
                const cell = document.createElement('div');
                cell.className = 'schedule-cell';
                cell.dataset.day = day;
                cell.dataset.time = time;
                container.appendChild(cell);
            });
        });
        
        // Add courses to schedule
        this.selectedCourses.forEach(course => {
            course.schedule.forEach(session => {
                const [startTime] = session.time.split(' - ');
                const cells = container.querySelectorAll('.schedule-cell');
                const targetCell = Array.from(cells).find(cell => 
                    cell.dataset.day === session.day && 
                    cell.dataset.time === startTime
                );
                
                if (targetCell) {
                    const classEvent = document.createElement('div');
                    classEvent.className = `class-event ${course.type}`;
                    classEvent.textContent = `${course.code}`;
                    classEvent.title = `${course.name}\n${session.time}\n${session.location}`;
                    
                    classEvent.addEventListener('click', () => {
                        window.location.href = `map.html?course=${course.id}`;
                    });
                    
                    targetCell.appendChild(classEvent);
                }
            });
        });
    }
};