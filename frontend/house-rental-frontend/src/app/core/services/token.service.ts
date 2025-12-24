import { Injectable } from '@angular/core';

interface DecodedToken {
    id: number;
    email: string;
    role: string;
    exp: number;
}

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'auth_token';

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    decodeToken(token: string): DecodedToken | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    }

    isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded) return true;

        const expirationDate = new Date(decoded.exp * 1000);
        return expirationDate < new Date();
    }

    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) return null;

        const decoded = this.decodeToken(token);
        return decoded?.role || null;
    }
}
