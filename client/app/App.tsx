import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Home, About } from './components/home';
import { Login, SignUp, SignUpComplete } from './components/auth';
import { Dashboard } from './components/dashboard';
import { BalanceCreator } from './components/balance';
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
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/create" component={BalanceCreator} />
        <Route path="/test" component={Test} />
      </Switch>
    </div>
  </Router>,
  document.getElementById('app')
);
