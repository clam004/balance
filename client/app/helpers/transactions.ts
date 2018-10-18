import { HttpResponse, get, post, del } from './http';

export const API_URL =  'https://appbalance.herokuapp.com' //'http://localhost:8000' // 

export interface IUser {
  id: number;
  email: string;
  num_completed_balances?:number;
  username?: string;
}

export interface IBalanceInfo {
  balance: {
    buyer?: object,
    seller?: object,
    agreement?: object
  }
}

export const getusers = (): Promise<HttpResponse> => {
  return get('/api/getusers');
};

export const get_users = (user_id: object): Promise<HttpResponse> => {
  return post('/api/get_users', user_id);
};

export const submitBalance = (IBalanceInfo: object): Promise<HttpResponse> => {
  return post('/api/submit_balance', IBalanceInfo);
};

export const toggleConfirm = (balance_id:object): Promise<HttpResponse> => {
  return post('/api/toggle_confirm', balance_id);
};

export const toggleComplete = (balance_id:object): Promise<HttpResponse> => {
  return post('/api/toggle_complete', balance_id);
};

export const balanceDone = (balance:object): Promise<HttpResponse> => {
  return post('/api/balance_done', balance);
};

/*

export const toggleConfirm = (balance_id:object) => {
  console.log(balance_id);
};


interface IBalanceUser {
  id:number,
  username: string;
  stake?: number;
  goods?: string;
  num_completed_balances?: number;
  failures?: number;
}

interface IBalanceAgreement {
  title?: string;
  description?: string;
  date?: string;
  price?: number;
}

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