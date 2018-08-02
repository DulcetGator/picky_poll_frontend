import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import CreatePollForm from "./create/CreatePollForm";

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
          </div>
        </Router>
      </div>
    );
  }
}

class CreatePollRoute extends Component<{}, { poll?: { id: string } }> {
  constructor(props: {}) {
    super(props);

    this.state = { poll: undefined };
  }

  render() {
    return this.state.poll ? (
      <Redirect to={"/view/" + this.state.poll.id} />
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
  let pollId = match.params.pollId;
  return <div>View Poll Details. PollId: {pollId}</div>;
};

export default App;
