// Course data management
const CourseManager = {
    courses: [],
    sectionsByParent: new Map(),

    init: function() {
        // Only initialize once
        if (this._initPromise) return this._initPromise;
        this._initPromise = this.loadCoursesFromCsv('./data/courses.csv').then(courses => {
            this.courses = courses;
            this.indexSectionsByParent();
            console.log(`Loaded ${this.courses.length} courses from CSV`);
        }).catch(err => {
            console.error('Failed to load courses:', err);
            this.courses = [];
            this.sectionsByParent.clear();
        });
        return this._initPromise;
    },

    loadCoursesFromCsv: async function(path) {
        const response = await fetch(path, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        return this.parseCsv(text);
    },

    parseCsv: function(text) {
        // Simple CSV parser that handles quoted fields with commas
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length <= 1) return [];
        const headers = this.splitCsvLine(lines[0]);
        const records = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = this.splitCsvLine(lines[i]);
            if (cols.length === 0) continue;
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = cols[idx] !== undefined ? cols[idx] : '';
            });
            const course = this.mapRowToCourse(row);
            records.push(course);
        }
        return records;
    },

    splitCsvLine: function(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++; // skip escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result.map(s => s.trim());
    },

    mapRowToCourse: function(row) {
        const id = parseInt(row.id, 10);
        const credits = Number(row.credits) || 0;
        const seatsAvailable = Number(row.seats_available) || 0;
        const seatsTotal = Number(row.seats_total) || 0;
        const lat = Number(row.lat) || 0;
        const lng = Number(row.lng) || 0;

        const days = row.days.replace(/^"|"$/g, '').split(',').map(d => d.trim()).filter(Boolean);
        const timeRange = row.times.replace(/^"|"$/g, '');
        const schedule = days.map(d => ({
            day: this.normalizeDay(d),
            time: this.normalizeTimeRange(timeRange),
            location: row.location
        }));

        return {
            id: id,
            code: row.code,
            name: row.name,
            department: row.department,
            level: String(row.level || ''),
            credits: credits,
            instructor: row.instructor,
            description: row.description,
            seats: { available: seatsAvailable, total: seatsTotal },
            type: (row.type || 'lecture').toLowerCase(),
            parentCourseId: row.parent_course ? parseInt(row.parent_course, 10) : null,
            schedule: schedule,
            location: { lat: lat, lng: lng }
        };
    },

    normalizeDay: function(day) {
        const map = { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun' };
        return map[day] || day;
    },

    normalizeTimeRange: function(range) {
        // Convert formats like "9:00 AM-10:30 AM" to "9:00 AM - 10:30 AM"
        return range.replace(/\s*-\s*/, ' - ');
    },

    indexSectionsByParent: function() {
        this.sectionsByParent.clear();
        this.courses.forEach(c => {
            if (c.parentCourseId) {
                const list = this.sectionsByParent.get(c.parentCourseId) || [];
                list.push(c);
                this.sectionsByParent.set(c.parentCourseId, list);
            }
        });
    },

    getDepartments: function() {
        const set = new Set(this.courses.map(c => c.department).filter(Boolean));
        return Array.from(set).sort();
    },

    getCourseById: function(id) {
        return this.courses.find(c => c.id === id) || null;
    },

    getRelatedSections: function(courseId) {
        return this.sectionsByParent.get(courseId) || [];
    },

    filterCourses: function(department, level, searchTerm) {
        const search = (searchTerm || '').toLowerCase().trim();
        const selectedLevel = (level || '').trim();

        // Only show top-level lectures in list; sections appear automatically when added
        return this.courses.filter(c => {
            if (c.type !== 'lecture') return false;
            if (department && c.department !== department) return false;
            if (selectedLevel && !String(c.level || '').startsWith(selectedLevel)) return false;
            if (search) {
                const hay = `${c.code} ${c.name} ${c.instructor} ${c.description}`.toLowerCase();
                if (!hay.includes(search)) return false;
            }
            return true;
        }).sort((a, b) => a.code.localeCompare(b.code));
    }
};


