// Student Verification & Portfolio System
class StudentVerification {
    constructor() {
        this.verificationLevels = {
            'basic': { requirements: ['email'], badge: '📧', trustScore: 20 },
            'university': { requirements: ['university_id'], badge: '🎓', trustScore: 60 },
            'national': { requirements: ['national_id'], badge: '🆔', trustScore: 80 },
            'premium': { requirements: ['university_id', 'national_id', 'portfolio'], badge: '⭐', trustScore: 100 }
        };
    }

    async verifyUniversityID(studentData) {
        const { university, studentId, fullName, graduationYear } = studentData;
        
        // Simulate university API verification
        const verification = {
            id: 'UNIV_' + Date.now(),
            university,
            studentId,
            fullName,
            graduationYear,
            department: studentData.department || 'Computer Science',
            status: 'verified',
            verifiedAt: new Date().toISOString(),
            trustScore: 60
        };
        
        return {
            success: true,
            verification,
            badge: '🎓 University Verified',
            benefits: [
                'Access to university-exclusive jobs',
                'Higher trust score',
                'Priority in applications',
                'Reduced platform fees'
            ]
        };
    }

    async verifyNationalID(nationalData) {
        const { nationalId, fullName, birthDate, region } = nationalData;
        
        // Ethiopian National ID format validation
        const idPattern = /^\d{10}$/;
        if (!idPattern.test(nationalId)) {
            return { success: false, error: 'Invalid Ethiopian National ID format' };
        }
        
        return {
            success: true,
            verification: {
                id: 'NAT_' + Date.now(),
                nationalId: nationalId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
                fullName,
                birthDate,
                region,
                status: 'verified',
                verifiedAt: new Date().toISOString(),
                trustScore: 80
            },
            badge: '🆔 National ID Verified',
            benefits: [
                'Access to government internships',
                'Maximum trust score',
                'Premium job matching',
                'Escrow protection'
            ]
        };
    }
}

// Rich Portfolio System
class StudentPortfolio {
    constructor() {
        this.portfolioSections = [
            'personal_info', 'education', 'skills', 'projects', 
            'experience', 'certifications', 'achievements', 'media'
        ];
    }

    createPortfolio(studentData) {
        return {
            id: 'PORT_' + Date.now(),
            studentId: studentData.id,
            sections: {
                personal_info: {
                    fullName: studentData.name,
                    title: studentData.title || 'Computer Science Student',
                    bio: studentData.bio || '',
                    location: studentData.location || 'Addis Ababa, Ethiopia',
                    languages: studentData.languages || ['Amharic', 'English'],
                    profileImage: studentData.avatar || null
                },
                education: {
                    university: studentData.university,
                    degree: studentData.degree || 'Bachelor of Science',
                    department: studentData.department || 'Computer Science',
                    graduationYear: studentData.graduationYear,
                    gpa: studentData.gpa || null,
                    relevantCourses: studentData.courses || []
                },
                skills: {
                    technical: studentData.skills || [],
                    soft: ['Communication', 'Teamwork', 'Problem Solving'],
                    languages: ['Amharic (Native)', 'English (Fluent)']
                },
                projects: [],
                experience: [],
                certifications: [],
                achievements: [],
                media: {
                    resume: null,
                    portfolio_links: [],
                    project_demos: [],
                    certificates: []
                }
            },
            visibility: 'public',
            completeness: this.calculateCompleteness(studentData),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    addProject(portfolioId, projectData) {
        const project = {
            id: 'PROJ_' + Date.now(),
            title: projectData.title,
            description: projectData.description,
            technologies: projectData.technologies || [],
            category: projectData.category || 'Web Development',
            status: projectData.status || 'Completed',
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            links: {
                github: projectData.githubUrl || null,
                live: projectData.liveUrl || null,
                demo: projectData.demoUrl || null
            },
            media: {
                screenshots: projectData.screenshots || [],
                videos: projectData.videos || []
            },
            collaborators: projectData.collaborators || [],
            achievements: projectData.achievements || [],
            createdAt: new Date().toISOString()
        };
        
        return project;
    }

    calculateCompleteness(data) {
        let score = 0;
        const weights = {
            personal_info: 20,
            education: 15,
            skills: 15,
            projects: 20,
            experience: 10,
            certifications: 10,
            media: 10
        };
        
        // Personal info
        if (data.name && data.bio && data.location) score += weights.personal_info;
        
        // Education
        if (data.university && data.department) score += weights.education;
        
        // Skills
        if (data.skills && data.skills.length >= 3) score += weights.skills;
        
        // Projects (need at least 2)
        if (data.projects && data.projects.length >= 2) score += weights.projects;
        
        // Media (resume required)
        if (data.resume) score += weights.media;
        
        return Math.min(score, 100);
    }
}

// Advanced Job Matching System
class JobMatchingEngine {
    constructor() {
        this.matchingFactors = {
            skills: 0.35,
            location: 0.15,
            experience: 0.20,
            education: 0.10,
            salary: 0.10,
            availability: 0.10
        };
    }

    findMatches(student, jobs) {
        return jobs.map(job => {
            const score = this.calculateMatchScore(student, job);
            return {
                job,
                score,
                reasons: this.getMatchReasons(student, job, score),
                recommendations: this.getImprovementSuggestions(student, job)
            };
        }).filter(match => match.score >= 60)
          .sort((a, b) => b.score - a.score);
    }

    calculateMatchScore(student, job) {
        let totalScore = 0;
        
        // Skills matching
        const skillMatch = this.calculateSkillMatch(student.skills, job.requiredSkills);
        totalScore += skillMatch * this.matchingFactors.skills;
        
        // Location preference
        const locationMatch = this.calculateLocationMatch(student.location, job.location);
        totalScore += locationMatch * this.matchingFactors.location;
        
        // Experience level
        const experienceMatch = this.calculateExperienceMatch(student.experience, job.experienceLevel);
        totalScore += experienceMatch * this.matchingFactors.experience;
        
        // Education match
        const educationMatch = this.calculateEducationMatch(student.education, job.educationRequirement);
        totalScore += educationMatch * this.matchingFactors.education;
        
        // Salary expectations
        const salaryMatch = this.calculateSalaryMatch(student.expectedSalary, job.salary);
        totalScore += salaryMatch * this.matchingFactors.salary;
        
        // Availability
        const availabilityMatch = this.calculateAvailabilityMatch(student.availability, job.schedule);
        totalScore += availabilityMatch * this.matchingFactors.availability;
        
        return Math.round(totalScore * 100);
    }

    calculateSkillMatch(studentSkills, requiredSkills) {
        if (!requiredSkills || requiredSkills.length === 0) return 1;
        
        const matches = requiredSkills.filter(required =>
            studentSkills.some(student => 
                student.name.toLowerCase().includes(required.toLowerCase()) ||
                required.toLowerCase().includes(student.name.toLowerCase())
            )
        );
        
        return matches.length / requiredSkills.length;
    }

    calculateLocationMatch(studentLocation, jobLocation) {
        if (jobLocation === 'Remote') return 1;
        if (studentLocation === jobLocation) return 1;
        
        // Ethiopian cities proximity matching
        const proximityMap = {
            'Addis Ababa': ['Adama', 'Bishoftu', 'Holeta'],
            'Bahir Dar': ['Gondar', 'Debre Markos'],
            'Hawassa': ['Shashemene', 'Dilla']
        };
        
        for (const [city, nearby] of Object.entries(proximityMap)) {
            if (studentLocation === city && nearby.includes(jobLocation)) return 0.8;
            if (jobLocation === city && nearby.includes(studentLocation)) return 0.8;
        }
        
        return 0.3; // Different regions
    }

    calculateExperienceMatch(studentExp, requiredExp) {
        const expLevels = { 'Entry': 0, 'Junior': 1, 'Mid': 3, 'Senior': 5 };
        const studentLevel = expLevels[studentExp] || 0;
        const requiredLevel = expLevels[requiredExp] || 0;
        
        if (studentLevel >= requiredLevel) return 1;
        if (studentLevel >= requiredLevel - 1) return 0.8;
        return 0.5;
    }

    calculateEducationMatch(studentEdu, requiredEdu) {
        const eduLevels = { 'High School': 1, 'Diploma': 2, 'Bachelor': 3, 'Master': 4, 'PhD': 5 };
        const studentLevel = eduLevels[studentEdu] || 3;
        const requiredLevel = eduLevels[requiredEdu] || 3;
        
        return studentLevel >= requiredLevel ? 1 : 0.7;
    }

    calculateSalaryMatch(expectedSalary, jobSalary) {
        if (!expectedSalary || !jobSalary) return 1;
        
        const jobSalaryNum = parseInt(jobSalary.replace(/[^\d]/g, ''));
        if (jobSalaryNum >= expectedSalary * 0.8) return 1;
        if (jobSalaryNum >= expectedSalary * 0.6) return 0.8;
        return 0.5;
    }

    calculateAvailabilityMatch(studentAvail, jobSchedule) {
        if (!studentAvail || !jobSchedule) return 1;
        
        const availMap = {
            'Full-time': ['Full-time'],
            'Part-time': ['Part-time', 'Flexible'],
            'Flexible': ['Part-time', 'Flexible', 'Full-time'],
            'Internship': ['Internship', 'Part-time']
        };
        
        return availMap[studentAvail]?.includes(jobSchedule) ? 1 : 0.6;
    }

    getMatchReasons(student, job, score) {
        const reasons = [];
        
        if (score >= 90) reasons.push('🎯 Perfect match for your profile');
        if (score >= 80) reasons.push('⭐ Highly recommended');
        if (score >= 70) reasons.push('✅ Good fit for your skills');
        
        // Specific reasons
        const skillMatch = this.calculateSkillMatch(student.skills, job.requiredSkills);
        if (skillMatch >= 0.8) reasons.push('🔧 Strong skill alignment');
        
        if (job.location === 'Remote') reasons.push('🏠 Remote work available');
        if (student.location === job.location) reasons.push('📍 Local opportunity');
        
        return reasons;
    }

    getImprovementSuggestions(student, job) {
        const suggestions = [];
        
        const skillMatch = this.calculateSkillMatch(student.skills, job.requiredSkills);
        if (skillMatch < 0.7) {
            const missingSkills = job.requiredSkills.filter(required =>
                !student.skills.some(student => 
                    student.name.toLowerCase().includes(required.toLowerCase())
                )
            );
            suggestions.push(`📚 Learn: ${missingSkills.join(', ')}`);
        }
        
        if (student.experience < job.experienceLevel) {
            suggestions.push('💼 Gain more experience through internships');
        }
        
        return suggestions;
    }
}

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StudentVerification,
        StudentPortfolio,
        JobMatchingEngine
    };
}