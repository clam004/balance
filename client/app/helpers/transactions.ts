import { HttpResponse, get, post, del } from './http';

export interface Iuser_id {
  user_id: string;
}

export const API_URL =     'https://appbalance.herokuapp.com' // 'http://localhost:8000' // 

/*

export const get_balances = (credentials: object): Promise<Iuser_id> => {
  return post('/api/get_balances', credentials)
    .then((res: HttpResponse) => res.user);
};



export const get_balances = (credentials: object): Promise<Iuser_id> => {
  return get('/api/balances/'+ credentials.user_id)
    .then((res: HttpResponse) => res.user);
};

*/