// AI Content Moderation Utility
// Blocks external links, payment requests, phone numbers, and inappropriate content

export interface ModerationResult {
    allowed: boolean;
    reason?: string;
    flaggedContent?: string[];
    severity: 'low' | 'medium' | 'high';
}

export const contentModeration = {
    // Detect external links (http://, https://, www.)
    hasExternalLink: (text: string): boolean => {
        const linkPatterns = [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/gi,
            /www\.[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/gi,
            /\b[a-zA-Z0-9-]+\.(com|net|org|edu|gov|et|io|co)\b/gi
        ];
        return linkPatterns.some(pattern => pattern.test(text));
    },

    // Detect Ethiopian phone numbers
    hasPhoneNumber: (text: string): boolean => {
        const phonePatterns = [
            /\+251\d{9}/g,           // +251912345678
            /251\d{9}/g,             // 251912345678
            /09\d{8}/g,              // 0912345678
            /07\d{8}/g,              // 0712345678
            /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g  // 091-234-5678
        ];
        return phonePatterns.some(pattern => pattern.test(text));
    },

    // Detect payment-related keywords
    hasPaymentRequest: (text: string): boolean => {
        const paymentKeywords = [
            'bank account',
            'account number',
            'send money',
            'transfer',
            'telebirr',
            'cbe birr',
            'mpesa',
            'paypal',
            'wire transfer',
            'swift code',
            'iban',
            'routing number',
            'pay me',
            'payment',
            'cash app',
            'venmo'
        ];

        const lowerText = text.toLowerCase();
        return paymentKeywords.some(keyword => lowerText.includes(keyword));
    },

    // Detect bank account patterns
    hasBankAccount: (text: string): boolean => {
        // Ethiopian bank account patterns (typically 13-16 digits)
        const accountPattern = /\b\d{13,16}\b/g;
        return accountPattern.test(text);
    },

    // Detect suspicious URLs
    hasSuspiciousURL: (text: string): boolean => {
        const suspiciousPatterns = [
            /bit\.ly/gi,
            /tinyurl/gi,
            /goo\.gl/gi,
            /ow\.ly/gi,
            /t\.co/gi,
            /short/gi
        ];
        return suspiciousPatterns.some(pattern => pattern.test(text));
    },

    // Detect spam keywords
    hasSpamKeywords: (text: string): boolean => {
        const spamKeywords = [
            'earn money fast',
            'get rich quick',
            'work from home',
            'easy money',
            'click here',
            'limited time',
            'act now',
            'congratulations',
            'you won',
            'claim your prize',
            'free money',
            'guaranteed income'
        ];

        const lowerText = text.toLowerCase();
        return spamKeywords.some(keyword => lowerText.includes(keyword));
    },

    // Comprehensive moderation check
    moderateContent: (text: string, allowLinks = false): ModerationResult => {
        const flaggedContent: string[] = [];
        let severity: 'low' | 'medium' | 'high' = 'low';

        // Check for external links
        if (!allowLinks && contentModeration.hasExternalLink(text)) {
            flaggedContent.push('External link detected');
            severity = 'medium';
        }

        // Check for phone numbers
        if (contentModeration.hasPhoneNumber(text)) {
            flaggedContent.push('Phone number detected');
            severity = 'high';
        }

        // Check for payment requests
        if (contentModeration.hasPaymentRequest(text)) {
            flaggedContent.push('Payment-related content detected');
            severity = 'high';
        }

        // Check for bank accounts
        if (contentModeration.hasBankAccount(text)) {
            flaggedContent.push('Bank account number detected');
            severity = 'high';
        }

        // Check for suspicious URLs
        if (contentModeration.hasSuspiciousURL(text)) {
            flaggedContent.push('Suspicious shortened URL detected');
            severity = 'high';
        }

        // Check for spam
        if (contentModeration.hasSpamKeywords(text)) {
            flaggedContent.push('Spam keywords detected');
            severity = 'medium';
        }

        return {
            allowed: flaggedContent.length === 0,
            reason: flaggedContent.length > 0 ? flaggedContent.join('; ') : undefined,
            flaggedContent,
            severity
        };
    },

    // Sanitize text (remove blocked content)
    sanitizeText: (text: string): string => {
        let sanitized = text;

        // Remove URLs
        sanitized = sanitized.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/gi, '[Link Removed]');

        // Remove phone numbers
        sanitized = sanitized.replace(/\+?251\d{9}/g, '[Phone Removed]');
        sanitized = sanitized.replace(/0[79]\d{8}/g, '[Phone Removed]');

        // Remove potential bank accounts
        sanitized = sanitized.replace(/\b\d{13,16}\b/g, '[Account Removed]');

        return sanitized;
    }
};
