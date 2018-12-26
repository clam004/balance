import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SideNav } from '../nav';

interface SupportState {}

class Support extends React.Component<RouteComponentProps<{}>, SupportState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="dashboard-container">
        <SideNav />
        Carson Made This Change, Vicki made this change, 
        Please email deepnetworkresearch [at] gmail [dot] com for questions.
        Thank you 
      </div>
    );
  }
}

export default Support;