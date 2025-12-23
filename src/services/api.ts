import { API_BASE_URL } from '../config';
import { MOCK_JOBS, MOCK_USER, DISCOVER_USERS } from '../constants';
import { Job, UserProfile, UserRole, AdminRole } from '../types';

const API_BASE = API_BASE_URL;
const defaultHeaders = () => {
    const token = localStorage.getItem('tm_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...defaultHeaders(),
            ...(options.headers || {})
        }
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed with ${res.status}`);
    }
    return res.json();
};

/**
 * API Service Layer
 * 
 * This service acts as the interface to the backend.
 * Currently simulates network requests with latency (500-1000ms).
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthAPI {
    async login(email: string, password: string): Promise<{ user: UserProfile, token: string }> {
        const data = await request<{ user: UserProfile; token: string }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        return data;
    }

    async register(data: any): Promise<{ user: UserProfile, token: string }> {
        const res = await request<{ user: UserProfile; token: string }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return res;
    }
}

class JobsAPI {
    async getAll(filter: string = 'all'): Promise<Job[]> {
        // The backend handles filtering approved jobs for non-admins
        const jobs = await request<Job[]>('/api/jobs');
        if (filter === 'all') {
            return jobs;
        }
        return jobs.filter(j => j.type.toLowerCase().includes(filter));
    }

    async getById(id: string): Promise<Job | undefined> {
        return await request<Job>(`/api/jobs/${id}`);
    }

    async apply(jobId: string, coverLetter: string): Promise<{ success: boolean }> {
        return await request<{ success: boolean }>(`/api/jobs/${jobId}/apply`, {
            method: 'POST',
            body: JSON.stringify({ coverLetter })
        });
    }

    async moderate(jobId: string | number, status: 'Approved' | 'Rejected'): Promise<Job> {
        return await request<Job>(`/api/jobs/${jobId}/moderate`, {
            method: 'POST',
            body: JSON.stringify({ status })
        });
    }
}

class UserAPI {
    async getMe(): Promise<UserProfile> {
        return await request<UserProfile>('/api/users/me');
    }

    async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
        if (!updates.id) throw new Error('User id is required to update profile');
        return await request<UserProfile>(`/api/users/${updates.id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async getDiscoverUsers(): Promise<UserProfile[]> {
        return await request<UserProfile[]>('/api/users/discover');
    }

    async getAll(): Promise<UserProfile[]> {
        const res = await request<{ success: boolean, users: UserProfile[] }>('/api/users');
        return res.users || [];
    }

    async banUser(id: string | number): Promise<{ success: boolean }> {
        return await request<{ success: boolean }>(`/api/users/${id}/ban`, { method: 'POST' });
    }

    async unbanUser(id: string | number): Promise<{ success: boolean }> {
        return await request<{ success: boolean }>(`/api/users/${id}/unban`, { method: 'POST' });
    }
}

class CourseAPI {
    async getAll(): Promise<any[]> {
        return await request<any[]>('/api/courses');
    }

    async create(data: any): Promise<any> {
        return await request<any>('/api/courses', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async enroll(id: string): Promise<any> {
        return await request<any>(`/api/courses/${id}/enroll`, {
            method: 'POST'
        });
    }
}

class WalletAPI {
    async getBalance(): Promise<{ balance: number }> {
        return await request<{ balance: number }>('/api/wallet/balance');
    }

    async getTransactions(): Promise<any[]> {
        return await request<any[]>('/api/wallet/transactions');
    }

    async send(data: { amount: number, recipientId: string, description?: string }): Promise<any> {
        return await request<any>('/api/wallet/send', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async topUpMpesa(amount: number, phoneNumber: string): Promise<any> {
        return await request<any>('/api/wallet/mpesa/topup', {
            method: 'POST',
            body: JSON.stringify({ amount, phoneNumber })
        });
    }
}

class MessagesAPI {
    async getConversation(userId: string): Promise<any[]> {
        return await request<any[]>(`/api/messages/${userId}`);
    }

    async sendMessage(receiverId: string, text: string): Promise<any> {
        return await request<any>('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ receiverId, text })
        });
    }
}

class EkubAPI {
    async getAll(): Promise<any[]> {
        return await request<any[]>('/api/ekub');
    }

    async create(data: any): Promise<any> {
        return await request<any>('/api/ekub', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async join(id: string): Promise<any> {
        return await request<any>(`/api/ekub/${id}/join`, {
            method: 'POST'
        });
    }

    async contribute(id: string): Promise<any> {
        return await request<any>(`/api/ekub/${id}/contribute`, {
            method: 'POST'
        });
    }

    async rotate(id: string): Promise<any> {
        return await request<any>(`/api/ekub/${id}/rotate`, {
            method: 'POST'
        });
    }
}

class AdminAPI {
    async getStats(): Promise<any> {
        return await request<any>('/api/admin/stats');
    }
}

class SubscriptionAPI {
    async getCurrent(): Promise<any> {
        return await request<any>('/api/subscription/current');
    }

    async upgrade(data: { tier: string; paymentMethod: string; transactionId: string }): Promise<any> {
        return await request<any>('/api/subscription/upgrade', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async cancel(): Promise<any> {
        return await request<any>('/api/subscription/cancel', {
            method: 'POST'
        });
    }
}

export const api = {
    auth: new AuthAPI(),
    jobs: new JobsAPI(),
    user: new UserAPI(),
    courses: new CourseAPI(),
    wallet: new WalletAPI(),
    messages: new MessagesAPI(),
    ekub: new EkubAPI(),
    admin: new AdminAPI(),
    subscription: new SubscriptionAPI()
};
