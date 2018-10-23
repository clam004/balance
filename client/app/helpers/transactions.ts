import { HttpResponse, get, post, del } from './http';

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

interface IBalance {
    title:string,
    balance_description:string,
    buyer_obligation:string,
    seller_obligation:string,
    buyer_email: string,
    seller_email:string,
    buyer_stake_amount:number,
    seller_stake_amount:number,
    balance_price:number,
    completed:boolean,
    agreement_confirmed:boolean,
    agreement_status:string,
    buyer_id:number,
    seller_id:number,
    created_at:string,
    updated_at:string,
    due_date:string,
    id:number 
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

export const get_balance_data = (balance_id:object): Promise<HttpResponse> => {
  return post('/api/get_balance_data', balance_id);
};

export const balanceDelete = (balance:object): Promise<HttpResponse> => {
  return post('/api/balance_delete', balance);
};

export const getBalances = (balance:object): Promise<HttpResponse> => {
  return post('/api/get_balances', balance);
};

export const API_URL = 'http://localhost:8000' // 'https://appbalance.herokuapp.com' // 

/*

export const getBalances = (balance:object): Promise<HttpResponse> => {
  return post('/api/get_balances', balance);
};

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