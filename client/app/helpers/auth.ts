import { HttpResponse, get, post, del } from './http';

export interface IUser {
  id: number;
  email: string;
  num_completed_balances?:number;
  username?: string;
}

export const signup = (params: object): Promise<IUser> => {
  return post('/api/signup', params)
    .then((res: HttpResponse) => res.user);
};

export const login = (credentials: object): Promise<IUser> => {
  return post('/api/login', credentials)
    .then((res: HttpResponse) => res.user);
};

export const logout = (): Promise<HttpResponse> => {
  return del('/api/logout');
};

export const getUserData = (): Promise<HttpResponse> => {
  return post('/api/get_user_data');
};

export const isLoggedIn = (): Promise<HttpResponse> => {
  return post('/api/is_logged_in');
};
