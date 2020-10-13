import React, { Component } from "react";
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Home from './home/Home'
import ViewPoll from './viewPoll/ViewPoll'
import CreatePollForm from './create/CreatePollForm'
import { LocalStoreIdentityService } from "./userIdentity";

type Props = {};
type State = {
  identityService: LocalStoreIdentityService
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      identityService: new LocalStoreIdentityService()
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <header className="App-header">
            <Link to="/">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </Link>
          </header>
          <Switch>
            <Route path="/create" component={CreatePollRoute} />
            <Route path="/view/:pollId" component={PollDetailsRoute} />
            <Route exact path="/" component={HomeRoute} />
          </Switch>
        </Router>
      </div>
    );
  }
}

class HomeRoute extends Component<{}, {}> {
  render() {
    return <Home />
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
      <CreatePollForm onCreatePoll={p => {
        this.setState({ poll: p });
      }}/>
    );
  }
}

const PollDetailsRoute = ({ match: {params: {pollId} } }: {match: {params: {pollId: string }}}) => {
  return <ViewPoll pollId={pollId} />
};

export default App;
