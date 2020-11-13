import React, { Component, ReactNode } from 'react';
import { ListGroup } from 'react-bootstrap';
import {
  BrowserRouter as Router, Link, Redirect, Route, Switch,
} from 'react-router-dom';
import './App.css';
import { About } from './about/About';
import Home from './home/Home';
import { ListPolls } from './list/ListPolls';
import ViewPoll from './viewPoll/ViewPoll';
import CreatePollForm from './create/CreatePollForm';
import { LocalStoreIdentityService } from './userIdentity';

type Props = unknown;
type State = {
  identityService: LocalStoreIdentityService
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      identityService: new LocalStoreIdentityService(),
    };
  }

  private navLinks() {
    return [
      { path: '/polls', name: 'View Polls' },
      { path: '/create', name: 'Create Poll' },
      { path: '/about', name: 'About' },
    ];
  }

  render(): ReactNode {
    return (
      <div className="App">
        <Router>
          <header className="App-header">
            <div className="app-name">Picky Poll</div>
            <ListGroup horizontal>
              {this.navLinks().map((l) => (
                <Link to={l.path} key={l.name}>
                  <ListGroup.Item>
                    {l.name}
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
          </header>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/create" component={CreatePollRoute} />
            <Route path="/polls/:pollId" component={PollDetailsRoute} />
            <Route path="/polls/" component={ListPollRoute} />
            <Route exact path="/" component={HomeRoute} />
          </Switch>
        </Router>
      </div>
    );
  }
}

function HomeRoute() {
  return <Home />;
}

function ListPollRoute() {
  return <ListPolls />;
}

class CreatePollRoute extends Component<unknown, { poll?: { id: string } }> {
  constructor(props: unknown) {
    super(props);

    this.state = { poll: undefined };
  }

  render() {
    return this.state.poll ? (
      <Redirect to={`/polls/${this.state.poll.id}`} push />
    ) : (
      <CreatePollForm onCreatePoll={(p) => {
        this.setState({ poll: p });
      }}
      />
    );
  }
}

const PollDetailsRoute = ({ match: { params: { pollId } } }: {match: {params: {pollId: string }}}) => <ViewPoll pollId={pollId} />;

export default App;
