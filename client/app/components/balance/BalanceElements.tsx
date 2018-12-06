import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import './Dashboard.less';
import * as moment from 'moment';

interface IBalanceUser {
  id?:number,
  username: string;
  email?:string;
  stake?: number;
  goods?: string;
  num_completed_balances?: number;
  failures?: number;
}

interface IBalanceAgreement {
  title?: string;
  buyer_obligation?: string;
  seller_obligation?: string;
  description?: string;
  date?: string;
  price?: number;
  duration?:number;
  duration_units?:string;
}

interface IBalance {
  createdAt?: string;
  buyer: IBalanceUser;
  seller: IBalanceUser;
  agreement: IBalanceAgreement;
  balance_id?: number;
}

export {IBalanceUser, IBalanceAgreement, IBalance};
