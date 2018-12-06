import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface SupportState {}

class Support extends React.Component<RouteComponentProps<{}>, SupportState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        Hello !! 
        Please email deepnetworkresearch@gmail.com for questions.
        Thank you 
      </div>
    );
  }
}

export default Support;