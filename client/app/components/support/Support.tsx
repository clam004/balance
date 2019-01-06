import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SideNav } from '../nav';

import {test_upload} from '../../helpers/usersbalances'; 

interface SupportState {
  
}

class Support extends React.Component<RouteComponentProps<{}>, SupportState> {

  constructor(props: RouteComponentProps<{}>) {

    super(props);

    this.state = {

    };

  }


  render() {
    return (
      <div className="dashboard-container">
        <SideNav />

        <div>vicki did this</div>
        <div>Carson did this</div>

        Please email deepnetworkresearch [at] gmail [dot] com for questions.
        Thank you 

        <br/>
      </div>
    );
  }
}

export default Support;