// Sample course data
const courses = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        level: 100,
        credits: 3,
        schedule: [
            { day: "Mon", time: "9:00 AM - 10:30 AM", location: "Science Building, Room 101" },
            { day: "Wed", time: "9:00 AM - 10:30 AM", location: "Science Building, Room 101" }
        ],
        location: { lat: 40.7589, lng: -73.9851 }
    },
    {
        id: 2,
        code: "MATH201",
        name: "Calculus I",
        department: "MATH",
        level: 200,
        credits: 4,
        schedule: [
            { day: "Tue", time: "11:00 AM - 12:30 PM", location: "Math Building, Room 205" },
            { day: "Thu", time: "11:00 AM - 12:30 PM", location: "Math Building, Room 205" }
        ],
        location: { lat: 40.7580, lng: -73.9845 }
    },
    {
        id: 3,
        code: "PHYS150",
        name: "General Physics I",
        department: "PHYS",
        level: 100,
        credits: 4,
        schedule: [
            { day: "Mon", time: "1:00 PM - 2:30 PM", location: "Physics Building, Room 110" },
            { day: "Wed", time: "1:00 PM - 2:30 PM", location: "Physics Building, Room 110" },
            { day: "Fri", time: "1:00 PM - 2:30 PM", location: "Physics Building, Lab 115" }
        ],
        location: { lat: 40.7575, lng: -73.9855 }
    },
    {
        id: 4,
        code: "CS301",
        name: "Data Structures and Algorithms",
        department: "CS",
        level: 300,
        credits: 3,
        schedule: [
            { day: "Tue", time: "10:00 AM - 11:30 AM", location: "Computer Science Building, Room 301" },
            { day: "Thu", time: "10:00 AM - 11:30 AM", location: "Computer Science Building, Room 301" }
        ],
        location: { lat: 40.7595, lng: -73.9840 }
    },
    {
        id: 5,
        code: "ENG202",
        name: "Circuits and Electronics",
        department: "ENG",
        level: 200,
        credits: 4,
        schedule: [
            { day: "Mon", time: "3:00 PM - 4:30 PM", location: "Engineering Building, Room 202" },
            { day: "Wed", time: "3:00 PM - 4:30 PM", location: "Engineering Building, Room 202" }
        ],
        location: { lat: 40.7585, lng: -73.9835 }
    }
];

// Course-related functions
const CourseManager = {
    // Filter courses based on criteria
    filterCourses: function(department, level, search) {
        return courses.filter(course => {
            return (!department || course.department === department) &&
                   (!level || course.level.toString().startsWith(level)) &&
                   (!search || 
                    course.code.toLowerCase().includes(search) || 
                    course.name.toLowerCase().includes(search));
        });
    },

    // Get course by ID
    getCourseById: function(id) {
        return courses.find(course => course.id === id);
    },

    // Get all courses
    getAllCourses: function() {
        return courses;
    }
};