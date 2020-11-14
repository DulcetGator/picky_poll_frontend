import React from 'react';
import { Card } from 'react-bootstrap';
import './About.css';

export function About() {
  return (
    <div className="About">
      <h1>Convenient ranked-choice voting</h1>
      <div className="intro-cards">
        <div className="card-wrapper">
          <Card>
            <Card.Title>
              Quick, simple workflow
            </Card.Title>
            <ul>
              <li>
                Create polls and vote on them with
                {' '}
                <em>no registration required</em>
                .
              </li>
              <li>
                Invite your acquaintances to vote by simply the poll's secret URL.
              </li>
              <li>
                Voters rank choices by order of preference, then submit their ballot.
              </li>
            </ul>
          </Card>
        </div>
        <div className="card-wrapper">
          <Card>
            <Card.Title>
              Transparent
            </Card.Title>
            <ul>
              <li>
                Each person with the poll's secret URL sees all ballots that were cast, and can
                audit the poll.
              </li>
              <li>
                Picky Poll uses
                {' '}
                <a href={encodeURI("https://en.wikipedia.org/wiki/Copeland's method")}>
                  Copeland's method
                </a>
                {' '}
                (one specific
                {' '}
                <a href={"https://en.wikipedia.org/wiki/Condorcet_method"}>
                  Condorcet methods
                </a>
                ) to determine the winner and relative rankings.
              </li>
            </ul>
          </Card>
          </div>
        <div className="card-wrapper">
          <Card>
            <Card.Title>
              Secure...?
            </Card.Title>
            <ul>
              <li>
                Only users with the secret URL can see the poll or vote in it.
              </li>
              <li>
                Neither poll creators nor voters can cheat.
              </li>
              <li>
                Picky Poll does not require authentication, so somebody with a poll's secret URL
                could submit multiple ballots. Everyone can see when this happens, but not who did
                it. If this happens, you may need to use a website that makes voters authenticate.
              </li>
            </ul>
          </Card>
        </div>
      </div>
      <div className="suitable-for-text">
        Suitable for:
        <ul>
          <li>
            Game groups picking which board game to play next Saturday.
          </li>
          <li>
            Work teams picking which restaurant to go to.
          </li>
        </ul>

        Unsuitable for:
        <ul>
          <li>
            Uses requiring secret ballots
          </li>
          <li>
            Voting methods other than Copeland's method.
          </li>
          <li>
            Polls with large numbers of voters, which might include someone malicious.
            They can't rig the poll undetected, but they could force you to abandon it.
          </li>
        </ul>
      </div>
    </div>
  );
}
