import React from 'react';
import { Ballot } from '../../../../api';
import { InstantRunoffResult, instantRunoff } from '../../../../util/instantRunoff';
import { PhaseControls } from './PhaseControls';
import { PhaseExplainer } from './PhaseExplainer';
import { WinnerDisplay } from '../WinnerDisplay';
import './InstantRunoffExplainer.css';

type Props = {
  isClosed: boolean,
  ballots: Ballot[],
}

type State = {
  phaseIndex: number
}

export default class InstantRunoffExplainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      phaseIndex: 0,
    };
  }

  makePhaseMutator(mutator: (old: number) => number) {
    return () => {
      const nextPhase = mutator(this.state.phaseIndex);
      this.setState({ phaseIndex: nextPhase });
    };
  }

  phaseControls(result: InstantRunoffResult) {
    return (
      <PhaseControls
        isFirst={this.state.phaseIndex <= 0}
        isLast={this.state.phaseIndex >= result.rounds.length - 1}
        onFirst={this.makePhaseMutator(() => 0)}
        onPrev={this.makePhaseMutator((i) => i - 1)}
        onNext={this.makePhaseMutator((i) => i + 1)}
        onLast={this.makePhaseMutator(() => result.rounds.length - 1)}
      />
    );
  }

  render() {
    const result = instantRunoff(this.props.ballots.map((b) => b.rankings));
    if (result.rounds.length > 1) {
      // drop the last round, which has only the winners.
      result.rounds.splice(result.rounds.length - 1, 1);
    }
    const phase = result.rounds[this.state.phaseIndex];
    return (
      <div className="StvExplainer">
        <WinnerDisplay
          winners={result.winners}
          isClosed={this.props.isClosed}
        />
        { phase
          ? (
            <>
              <div className="stv-explainer-header">
                <div className="round-indicator">
                  Round
                  {' '}
                  {this.state.phaseIndex + 1}
                </div>
                <div>
                  {this.phaseControls(result)}
                </div>
              </div>
              <PhaseExplainer round={phase} />
            </>
          )
          : null}
      </div>
    );
  }
}