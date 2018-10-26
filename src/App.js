import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import CreatePollForm from "./create/CreatePollForm";
import ViewPoll from "./viewPoll/ViewPoll";

type Props = {};

class App extends Component<Props> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Router>
          <div>
            <Route path="/create" component={CreatePollRoute} />
            <Route path="/view/:pollId" component={PollDetailsRoute} />
            <Route exact path="/" component={HomeRoute} />
          </div>
        </Router>
      </div>
    );
  }
}

class HomeRoute extends Component<{}, {}> {
  render() {
    return <Redirect to="/create" />;
  }
}

class CreatePollRoute extends Component<{}, { poll?: { id: string } }> {
  constructor(props: {}) {
    super(props);

    this.state = { poll: undefined };
  }

  render() {
    return this.state.poll ? (
      <Redirect to={`/view/${this.state.poll.id}`} push={true} />
    ) : (
      <CreatePollForm
        onCreatePoll={p => {
          this.setState({ poll: p });
        }}
      />
    );
  }
}
const PollDetailsRoute = ({ match }) => {
  return <ViewPoll pollId={match.params.pollId} />;
};

export default App;
