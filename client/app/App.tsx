import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Home, About } from './components/home';
import { Login, SignUp, SignUpComplete } from './components/auth';
import { Buying_Balances, Selling_Balances, BalanceSummary, History, MyAccount } from './components/dashboard';
import { BalanceCreatorSell, BalanceCreatorBuy, BalanceEditor } from './components/balance';
import { Test } from './components/test';
import './App.less';

ReactDOM.render(
  <Router>
    <div className="app">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/about" component={About} />
        <Route path="/signup-complete" component={SignUpComplete} />
        <Route path="/buying-balances" component={Buying_Balances} />
        <Route path="/selling-balances" component={Selling_Balances} />
        <Route path="/balancesummary" component={BalanceSummary} />
        <Route path="/history" component={History} />
        <Route path="/create-buy" component={BalanceCreatorBuy} />
        <Route path="/create-sell" component={BalanceCreatorSell} />
        <Route path="/edit" component={BalanceEditor} />
        <Route path="/myaccount" component={MyAccount} />
        <Route path="/test" component={Test} />
      </Switch>
    </div>
  </Router>,
  document.getElementById('app')
);

