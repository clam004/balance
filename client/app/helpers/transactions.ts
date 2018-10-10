import { HttpResponse, get, post, del } from './http';

export const API_URL =   'http://localhost:8000' // 'https://appbalance.herokuapp.com' //

export interface IUser {
  id: number;
  email: string;
  num_completed_balances?:number;
  username?: string;
}

export const getusers = (): Promise<HttpResponse> => {
  return get('/api/getusers');
};

export const get_users = (user_id: object): Promise<HttpResponse> => {
  return post('/api/get_users', user_id);
};

/*

export const getusers = (): Promise<HttpResponse> => {
  return get('/api/getusers');
};

export const get_balances = (credentials: object): Promise<Iuser_id> => {
  return post('/api/get_balances', credentials)
    .then((res: HttpResponse) => res.user);
};



export const get_balances = (credentials: object): Promise<Iuser_id> => {
  return get('/api/balances/'+ credentials.user_id)
    .then((res: HttpResponse) => res.user);
};

*/