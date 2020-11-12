import React from 'react';
import { Card } from 'react-bootstrap';
import './About.css';

export function About() {
  return (
    <div className="About">
      <h1>Quick, auditable ranked-choice voting</h1>
      <div className="intro-cards">
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
              Invite your acquaintances to vote by simply sharing the poll's secret URL.
            </li>
          </ul>
        </Card>
        <Card>
          <Card.Title>
            Auditable
          </Card.Title>
          <ul>
            <li>
              See all ballots that were cast in any poll.
            </li>
            <li>
              Interactive explanation for Instant-runoff Voting winner.
            </li>
          </ul>
        </Card>
        <Card>
          <Card.Title>
            Secure...?
          </Card.Title>
          <ul>
            <li>
              Only users with the secret link can view the poll. Users can edit only ballots from their own device.
            </li>
            <li>
              Malicious users with the secret link can submit extra ballots, but any other
              user can see that someone did it (but not who).
            </li>
          </ul>
        </Card>
      </div>
      <div>
        Suitable for:
        <ul>
          <li>
            Game groups picking which board game to play next Saturday.
          </li>
          <li>
            Work teams picking which restaurant to go to.
          </li>
          <li>
            Any case where you might have voted by editing a company-internal wiki page.
          </li>
        </ul>

        Unsuitable for:
        <ul>
          <li>
            Uses requiring secret ballots
          </li>
          <li>
            Voting methods other than Instant-runoff voting
          </li>
          <li>
            Polls with large numbers of voters, which might include someone malicious.
            (They can't rig the poll undetected, but they could force you to abandon it.)
            Consider a website that supports registration/login instead.
          </li>
        </ul>
      </div>
    </div>
  );
}
