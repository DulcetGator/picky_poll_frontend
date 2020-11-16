import React from 'react';
import { KnownPoll } from '../../../userIdentity';
import { GetPollResponse } from '../../../api';
import { describeWinners } from '../../../util/describeWinners';
import { copeland } from '../../../util/copeland';

import './PollSummaryView.css';

type Props = {
  knownPoll: KnownPoll,
  poll: GetPollResponse,
}

export function PollSummaryView(props: Props) {
  const isClosed = !!props.poll.poll.close;
  const voted = (!isClosed) && props.knownPoll.knownBallots.length > 0;

  let ballotCountStatus = `${props.poll.ballots.length} ballots cast.`;
  if (!isClosed && !voted) {
    ballotCountStatus += ' (Cast yours!)';
  }

  let winnerDescription = null;
  if (props.poll.ballots.length > 0) {
    const result = copeland(props.poll.ballots.map((b) => b.rankings));
    const winnerDescriptionText = describeWinners(isClosed, result[0].candidates.map(c => c.candidate));
    winnerDescription = (
      <p className="poll-vote-status">
        {winnerDescriptionText}
      </p>
    );
  }

  return (
    <React.Fragment>
      <p className="poll-vote-status">{ballotCountStatus}</p>
      {winnerDescription}
    </React.Fragment>
  );
}
