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

export const get_init_users = (user_id: object): Promise<HttpResponse> => {
  return post('/api/get_init_users', user_id);
};

export const update_search_users = (search_input: object): Promise<HttpResponse> => {
  return post('/api/update_search_users', search_input);
};

export const submitBalance = (IBalanceInfo: object): Promise<HttpResponse> => {
  return post('/api/submit_balance', IBalanceInfo);
};

export const updateBalance = (IBalanceInfo: object): Promise<HttpResponse> => {
  return post('/api/update_balance', IBalanceInfo);
};

export const editBalance = (IBalanceInfo: object): Promise<HttpResponse> => {
  return post('/api/edit_balance', IBalanceInfo);
};

export const toggleApprove = (balance_seller_approves:object): Promise<HttpResponse> => {
  return post('/api/toggle_approve', balance_seller_approves);
};

export const toggleComplete = (balance_complete:object): Promise<HttpResponse> => {
  return post('/api/toggle_complete', balance_complete);
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

export const archiveEdit = (balance:object): Promise<HttpResponse> => {
  return post('/api/archive_edit', balance);
};

export const approveEdit = (balance:object): Promise<HttpResponse> => {
  return post('/api/approve_edit', balance);
};

export const getBalances = (buyer_or_seller_id:object): Promise<HttpResponse> => {
  return post('/api/get_incomplete_balances_by_id', buyer_or_seller_id);
};

export const getHistory = (): Promise<HttpResponse> => {
  return post('/api/get_history');
};

export const arbitrateBalance = (balance:object): Promise<HttpResponse> => {
  return post('/api/arbitrate_balance', balance);
};

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

export const API_URL = 'http://localhost:8000' // 'https://appbalance.herokuapp.com' // 

*/