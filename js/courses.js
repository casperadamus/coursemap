// Course data management
const CourseManager = {
    courses: [
        {
            id: 1,
            code: "CS 101",
            name: "Introduction to Computer Science",
            department: "CS",
            level: 1000,
            credits: 3,
            schedule: [
                { day: "Mon", time: "9:00 AM - 10:30 AM", location: "ITE Building Room 101" },
                { day: "Wed", time: "9:00 AM - 10:30 AM", location: "ITE Building Room 101" }
            ],
            location: { lat: 41.8075, lng: -72.2527 },
            instructor: "Dr. Smith",
            description: "Introduction to programming concepts",
            seats: { available: 15, total: 30 },
            type: "lecture",
            parent_course: ""
        },
        {
            id: 2,
            code: "CS 101",
            name: "Introduction to Computer Science",
            department: "CS",
            level: 1000,
            credits: 3,
            schedule: [
                { day: "Tue", time: "11:00 AM - 12:30 PM", location: "ITE Building Room 102" },
                { day: "Thu", time: "11:00 AM - 12:30 PM", location: "ITE Building Room 102" }
            ],
            location: { lat: 41.8075, lng: -72.2527 },
            instructor: "Dr. Smith",
            description: "Introduction to programming concepts",
            seats: { available: 12, total: 25 },
            type: "lecture",
            parent_course: ""
        },
        {
            id: 3,
            code: "CS 101L",
            name: "Computer Science Lab",
            department: "CS",
            level: 1000,
            credits: 1,
            schedule: [
                { day: "Fri", time: "2:00 PM - 4:00 PM", location: "ITE Lab 105" }
            ],
            location: { lat: 41.8075, lng: -72.2527 },
            instructor: "TA Johnson",
            description: "Programming lab session",
            seats: { available: 20, total: 25 },
            type: "lab",
            parent_course: "1"
        },
        {
            id: 4,
            code: "MATH 101",
            name: "Calculus I",
            department: "MATH",
            level: 1000,
            credits: 4,
            schedule: [
                { day: "Mon", time: "10:00 AM - 11:00 AM", location: "Math Building 201" },
                { day: "Wed", time: "10:00 AM - 11:00 AM", location: "Math Building 201" },
                { day: "Fri", time: "10:00 AM - 11:00 AM", location: "Math Building 201" }
            ],
            location: { lat: 41.8065, lng: -72.2532 },
            instructor: "Dr. Johnson",
            description: "Differential calculus",
            seats: { available: 20, total: 35 },
            type: "lecture",
            parent_course: ""
        },
        {
            id: 5,
            code: "MATH 101",
            name: "Calculus I",
            department: "MATH",
            level: 1000,
            credits: 4,
            schedule: [
                { day: "Tue", time: "1:00 PM - 2:30 PM", location: "Math Building 202" },
                { day: "Thu", time: "1:00 PM - 2:30 PM", location: "Math Building 202" }
            ],
            location: { lat: 41.8065, lng: -72.2532 },
            instructor: "Dr. Williams",
            description: "Differential calculus",
            seats: { available: 18, total: 30 },
            type: "lecture",
            parent_course: ""
        },
        {
            id: 6,
            code: "PHYS 101",
            name: "General Physics",
            department: "PHYS",
            level: 1000,
            credits: 4,
            schedule: [
                { day: "Mon", time: "1:00 PM - 2:30 PM", location: "Physics Building 101" },
                { day: "Wed", time: "1:00 PM - 2:30 PM", location: "Physics Building 101" }
            ],
            location: { lat: 41.8060, lng: -72.2540 },
            instructor: "Dr. Brown",
            description: "Mechanics and waves",
            seats: { available: 22, total: 40 },
            type: "lecture",
            parent_course: ""
        },
        {
            id: 7,
            code: "PHYS 101L",
            name: "Physics Lab",
            department: "PHYS",
            level: 1000,
            credits: 1,
            schedule: [
                { day: "Tue", time: "9:00 AM - 11:00 AM", location: "Physics Lab 115" }
            ],
            location: { lat: 41.8060, lng: -72.2540 },
            instructor: "Dr. Brown",
            description: "Experimental physics",
            seats: { available: 25, total: 30 },
            type: "lab",
            parent_course: "6"
        },
        {
            id: 8,
            code: "CHEM 101",
            name: "General Chemistry",
            department: "CHEM",
            level: 1000,
            credits: 4,
            schedule: [
                { day: "Tue", time: "10:00 AM - 11:30 AM", location: "Chemistry Building 201" },
                { day: "Thu", time: "10:00 AM - 11:30 AM", location: "Chemistry Building 201" }
            ],
            location: { lat: 41.8055, lng: -72.2535 },
            instructor: "Dr. Davis",
            description: "Chemical principles",
            seats: { available: 15, total: 32 },
            type: "lecture",
            parent_course: ""
        },
        {
            id: 9,
            code: "CHEM 101L",
            name: "Chemistry Lab",
            department: "CHEM",
            level: 1000,
            credits: 1,
            schedule: [
                { day: "Mon", time: "1:00 PM - 4:00 PM", location: "Chemistry Lab 215" }
            ],
            location: { lat: 41.8055, lng: -72.2535 },
            instructor: "Dr. Davis",
            description: "Chemical experiments",
            seats: { available: 28, total: 32 },
            type: "lab",
            parent_course: "8"
        },
        {
            id: 10,
            code: "ENG 101",
            name: "Academic Writing",
            department: "ENG",
            level: 1000,
            credits: 3,
            schedule: [
                { day: "Mon", time: "3:00 PM - 4:30 PM", location: "English Building 101" },
                { day: "Wed", time: "3:00 PM - 4:30 PM", location: "English Building 101" }
            ],
            location: { lat: 41.8080, lng: -72.2520 },
            instructor: "Dr. Wilson",
            description: "College writing skills",
            seats: { available: 8, total: 25 },
            type: "lecture",
            parent_course: ""
        }
    ],

    init: function() {
        console.log('Courses initialized:', this.courses.length);
        return this.courses;
    },

    filterCourses: function(department, level, search) {
        let filtered = this.courses.filter(course => course.type === 'lecture');
        
        if (department) {
            filtered = filtered.filter(course => course.department === department);
        }
        
        if (level) {
            filtered = filtered.filter(course => course.level.toString().startsWith(level));
        }
        
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(course => 
                course.code.toLowerCase().includes(searchLower) || 
                course.name.toLowerCase().includes(searchLower)
            );
        }
        
        return filtered;
    },

    getCourseById: function(id) {
        return this.courses.find(course => course.id === id);
    },

    getRelatedSections: function(lectureId) {
        return this.courses.filter(course => course.parent_course === lectureId.toString());
    },

    getDepartments: function() {
        const departments = [...new Set(this.courses.map(course => course.department))];
        return departments.sort();
    }
};