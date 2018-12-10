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

export const storeCustomerID = (plaid_token:object): Promise<HttpResponse> => {
  return post('/finapi/store_plaid_customer_id', plaid_token);
};

export const storeConnectAcctToken = (plaid_token:object): Promise<HttpResponse> => {
  return post('/finapi/store_connect_account_token', plaid_token);
};

export const getConnectData = (stripe_token:object): Promise<HttpResponse> => {
  return post('/finapi/get_connect_data', stripe_token);
};

export const buyerPaySeller = (balance:object): Promise<HttpResponse> => {
  return post('/finapi/buyer_pay_seller', balance);
};

export const stakeBalance = (balance:object): Promise<HttpResponse> => {
  return post('/finapi/stake_balance', balance);
};

/*

export const makeStripeCustomerID = (stripe_token:object): Promise<HttpResponse> => {
  return post('/finapi/stripe_customer_id', stripe_token);
};

*/