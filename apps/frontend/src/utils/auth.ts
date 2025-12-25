// Auth utility functions for security
export const authUtils = {
    // Clear all auth data
    clearAuth: () => {
        localStorage.removeItem('tm_user');
        localStorage.removeItem('tm_token');
        sessionStorage.clear();
    },

    // Verify token and decode
    verifyToken: (): { id: string; email: string; role: string; exp: number } | null => {
        try {
            const token = localStorage.getItem('tm_token');
            if (!token) return null;

            // Decode JWT payload
            const payload = token.split('.')[1];
            if (!payload) {
                authUtils.clearAuth();
                return null;
            }
            const decoded = JSON.parse(atob(payload));

            // Validate token structure
            if (!decoded.id || !decoded.exp || !decoded.email) {
                authUtils.clearAuth();
                return null;
            }

            // Check expiry from token payload
            if (Date.now() >= decoded.exp * 1000) {
                authUtils.clearAuth();
                return null;
            }

            return decoded;
        } catch (error) {
            console.error('Token verification failed:', error);
            authUtils.clearAuth();
            return null;
        }
    },

    // Auto-logout on token expiry
    setupAutoLogout: (dispatch: any) => {
        const checkExpiry = () => {
            const token = authUtils.verifyToken();
            if (!token) {
                dispatch({ type: 'LOGOUT' });
                // Only redirect if not already on a public page
                const currentHash = window.location.hash;
                if (!currentHash.includes('#/login') && !currentHash.includes('#/register')) {
                    window.location.hash = '#/login';
                }
            }
        };

        // Check every minute
        const interval = setInterval(checkExpiry, 60000);

        // Cleanup function
        return () => clearInterval(interval);
    }
};
