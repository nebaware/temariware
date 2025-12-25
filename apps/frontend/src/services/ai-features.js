// AI Skills & Verification System
class AISkillsEngine {
    constructor() {
        this.skillsDatabase = {
            'React': { category: 'Frontend', demand: 'High', salary: '8000-15000 ETB' },
            'Python': { category: 'Backend', demand: 'High', salary: '10000-18000 ETB' },
            'Flutter': { category: 'Mobile', demand: 'Medium', salary: '7000-12000 ETB' },
            'UI/UX': { category: 'Design', demand: 'High', salary: '6000-12000 ETB' },
            'Data Analysis': { category: 'Analytics', demand: 'High', salary: '9000-16000 ETB' }
        };
        
        this.ethiopianUniversities = [
            'Addis Ababa University', 'Jimma University', 'Bahir Dar University',
            'Hawassa University', 'Mekelle University', 'Haramaya University'
        ];
    }

    // AI-based job matching
    matchJobsToStudent(studentProfile) {
        const { skills, experience, location, expectedSalary } = studentProfile;
        const matches = [];
        
        jobs.forEach(job => {
            let score = 0;
            
            // Skill matching (40% weight)
            const skillMatch = job.tags.filter(tag => 
                skills.some(skill => skill.name.toLowerCase().includes(tag.toLowerCase()))
            ).length;
            score += (skillMatch / job.tags.length) * 40;
            
            // Location preference (20% weight)
            if (job.location === location || job.location === 'Remote') score += 20;
            
            // Salary match (20% weight)
            const jobSalary = parseInt(job.salary.replace(/[^\d]/g, ''));
            if (jobSalary >= expectedSalary * 0.8) score += 20;
            
            // Experience level (20% weight)
            if (job.type === 'Internship' && experience < 1) score += 20;
            else if (job.type === 'Entry-level' && experience <= 2) score += 20;
            
            if (score >= 60) {
                matches.push({ job, score: Math.round(score) });
            }
        });
        
        return matches.sort((a, b) => b.score - a.score);
    }

    // University ID verification
    verifyUniversityID(universityName, studentID) {
        if (!this.ethiopianUniversities.includes(universityName)) {
            return { valid: false, error: 'University not recognized' };
        }
        
        // Simulate ID format validation
        const idPattern = /^[A-Z]{2,3}\/\d{4}\/\d{2}$/;
        if (!idPattern.test(studentID)) {
            return { valid: false, error: 'Invalid ID format. Use format: ABC/1234/22' };
        }
        
        return { 
            valid: true, 
            verified: true,
            university: universityName,
            graduationYear: '20' + studentID.split('/')[2]
        };
    }

    // Skill gap analysis
    analyzeSkillGaps(studentSkills, targetJob) {
        const requiredSkills = targetJob.tags;
        const currentSkills = studentSkills.map(s => s.name);
        
        const gaps = requiredSkills.filter(skill => 
            !currentSkills.some(current => 
                current.toLowerCase().includes(skill.toLowerCase())
            )
        );
        
        const recommendations = gaps.map(skill => ({
            skill,
            courses: this.recommendCourses(skill),
            priority: this.skillsDatabase[skill]?.demand || 'Medium'
        }));
        
        return {
            missingSkills: gaps,
            recommendations,
            matchPercentage: Math.round(((requiredSkills.length - gaps.length) / requiredSkills.length) * 100)
        };
    }

    recommendCourses(skill) {
        const courseMap = {
            'React': ['React Fundamentals', 'Advanced React Patterns'],
            'Python': ['Python for Beginners', 'Data Science with Python'],
            'Flutter': ['Mobile App Development', 'Cross-platform Development'],
            'UI/UX': ['Design Principles', 'User Experience Design']
        };
        return courseMap[skill] || ['General Programming Course'];
    }

    // Reputation scoring
    calculateReputationScore(user) {
        let score = 0;
        
        // Profile completeness (30%)
        score += (user.profileStrength / 100) * 30;
        
        // Job completion rate (25%)
        const completionRate = user.completedJobs / (user.appliedJobs || 1);
        score += Math.min(completionRate * 25, 25);
        
        // Course completion (20%)
        score += Math.min((user.completedCourses || 0) * 5, 20);
        
        // Community engagement (15%)
        score += Math.min((user.forumPosts || 0) * 2, 15);
        
        // Verification status (10%)
        if (user.isVerified) score += 10;
        
        return Math.round(Math.min(score, 100));
    }
}

// Ethiopian Payment Integration
class EthiopianPayments {
    constructor() {
        this.providers = {
            telebirr: { fee: 0.02, minAmount: 10, maxAmount: 50000 },
            cbe: { fee: 0.015, minAmount: 50, maxAmount: 100000 },
            dashen: { fee: 0.018, minAmount: 25, maxAmount: 75000 }
        };
    }

    processPayment(amount, provider, purpose) {
        const config = this.providers[provider];
        if (!config) return { success: false, error: 'Provider not supported' };
        
        if (amount < config.minAmount || amount > config.maxAmount) {
            return { success: false, error: 'Amount out of range' };
        }
        
        const fee = amount * config.fee;
        const netAmount = amount - fee;
        
        // Simulate payment processing
        return {
            success: true,
            transactionId: 'ETH' + Date.now(),
            amount: netAmount,
            fee,
            provider,
            purpose,
            status: 'completed'
        };
    }

    // Escrow system for job payments
    createEscrow(jobId, amount, employer, freelancer) {
        return {
            id: 'ESC' + Date.now(),
            jobId,
            amount,
            employer,
            freelancer,
            status: 'held',
            createdAt: new Date().toISOString(),
            releaseConditions: ['job_completed', 'employer_approval']
        };
    }
}

// Multilingual Support
class AmharicSupport {
    constructor() {
        this.translations = {
            'Jobs': 'ስራዎች',
            'Profile': 'መገለጫ',
            'Wallet': 'ቦርሳ',
            'Courses': 'ኮርሶች',
            'Apply': 'ማመልከት',
            'Balance': 'ቀሪ ሂሳብ',
            'Level': 'ደረጃ',
            'Skills': 'ክህሎቶች',
            'University': 'ዩኒቨርሲቲ',
            'Student': 'ተማሪ',
            'Welcome': 'እንኳን ደህና መጡ'
        };
    }

    translate(text, targetLang = 'am') {
        if (targetLang === 'am') {
            return this.translations[text] || text;
        }
        return text;
    }

    formatEthiopianDate(date) {
        // Ethiopian calendar conversion (simplified)
        const ethiopianMonths = [
            'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
            'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
        ];
        
        const jsDate = new Date(date);
        const month = ethiopianMonths[jsDate.getMonth()];
        return `${jsDate.getDate()} ${month} ${jsDate.getFullYear() - 7}`;
    }
}

// AI Content Moderation
class AIModeration {
    constructor() {
        this.bannedPatterns = [
            /\b\d{10,}\b/, // Phone numbers
            /https?:\/\/[^\s]+/, // External links
            /telegram\.me|t\.me/, // Telegram links
            /whatsapp|wa\.me/, // WhatsApp
            /pay.*outside|bypass.*payment/i, // Payment bypass
            /contact.*directly|direct.*contact/i // Direct contact attempts
        ];
        
        this.suspiciousWords = [
            'payment', 'money', 'cash', 'transfer', 'outside', 'directly',
            'personal', 'private', 'contact', 'phone', 'call', 'meet'
        ];
    }

    moderateContent(content) {
        const violations = [];
        
        // Check for banned patterns
        this.bannedPatterns.forEach((pattern, index) => {
            if (pattern.test(content)) {
                violations.push({
                    type: ['phone', 'link', 'telegram', 'whatsapp', 'payment_bypass', 'direct_contact'][index],
                    severity: 'high'
                });
            }
        });
        
        // Check for suspicious word density
        const words = content.toLowerCase().split(/\s+/);
        const suspiciousCount = words.filter(word => 
            this.suspiciousWords.some(sus => word.includes(sus))
        ).length;
        
        if (suspiciousCount / words.length > 0.3) {
            violations.push({
                type: 'suspicious_content',
                severity: 'medium'
            });
        }
        
        return {
            allowed: violations.length === 0,
            violations,
            cleanContent: this.cleanContent(content, violations)
        };
    }

    cleanContent(content, violations) {
        let cleaned = content;
        
        this.bannedPatterns.forEach(pattern => {
            cleaned = cleaned.replace(pattern, '[REMOVED]');
        });
        
        return cleaned;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AISkillsEngine,
        EthiopianPayments,
        AmharicSupport,
        AIModeration
    };
}