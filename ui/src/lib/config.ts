export const API_BASE_URL = process.env.NEXT_PUBLIC_APP_ENV === 'production' 
  ? 'http://backend:8080' 
  : 'http://localhost:8080';

export const WS_BASE_URL = process.env.NEXT_PUBLIC_APP_ENV === 'production'
  ? 'ws://backend:8080'
  : 'ws://localhost:8080';
