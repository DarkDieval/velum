const API_URL = '/api/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  salt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Credentials {
  name?: string;
  email: string;
  password: string;
}

export const signupRequest = async (data: Credentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al registrarse');
  }

  return result;
};

export const signinRequest = async (data: Credentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al iniciar sesión');
  }

  return result;
};