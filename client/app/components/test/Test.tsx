import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface TestState {}

class Test extends React.Component<RouteComponentProps<{}>, TestState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        Test Page is different!
      </div>
    );
  }
}

export default Test;