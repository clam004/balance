import { HttpResponse, get, post, del } from './http';

export interface IUser {
  id: number;
  email: string;
  username: string;
}

export interface email_password {
  id: number;
  email: string;
  password: string;
}

export const signup = (params: object): Promise<email_password> => {
  return post('/api/signup', params)
    .then((res: HttpResponse) => res.user);
};

export const login = (credentials: object): Promise<email_password> => {
  //alert(JSON.stringify(credentials));
  return post('/api/login', credentials)
    .then((res: HttpResponse) => res.user);
};

export const logout = (): Promise<HttpResponse> => {
  return del('/api/logout');
};

