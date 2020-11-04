import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import {shallowArrayEq} from '../util/array'
import "./Ranker.css";

type CandidateProps = {
  name: string,
  onDrag: (dragInfo: CandidateDragInfo) => void,
  onDragEnd: () => void
  onProvideY: (y: number) => void
};

type CandidateState = {
};

type CandidateDragInfo = {
  y: number
}

class Candidate extends Component<CandidateProps, CandidateState> {
  card: HTMLElement | null = null;

  constructor(props: CandidateProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className={"candidate-wrapper"}>
        <div
          className={"candidate"}
          ref={c => this.card=c}
          draggable
          onDrag={e => this.onDrag(e)} 
          onDragEnd={e => this.onDragEnd(e)}>
          <Card>
            {this.props.name}
          </Card>
        </div>
      </div>
    );
  }

  getCenter(): { y: number } {
    let current = this.card;
    if (current != null) {
      let boundingRect = current.getBoundingClientRect();
      let y = boundingRect.top + boundingRect.height / 2;
      return { y: y };
    } else {
      throw new Error("Ref not set");
    }
  }

  onDrag(e: React.DragEvent) {
    e.preventDefault()
    if (e.clientY !== 0) {
      const info = {y: e.clientY}
      this.props.onDrag(info)
    }
  }

  onDragEnd(e: React.DragEvent) {
    e.dataTransfer.dropEffect = 'link'
    e.preventDefault();
    this.props.onDragEnd()
  }

  componentDidMount() {
    this.props.onProvideY(this.getCenter().y)
  }

  componentDidUpdate() {
    this.props.onProvideY(this.getCenter().y)
  }
}

type Props = {
  candidates: string[],
  onUpdateCandidates: (cs: string[]) => void
};

type RankerCandidateRef = {
  name: string,
  yPos: number,
}
type State = {
  candidatesFromProps: string[],
  orderedCandidates: RankerCandidateRef[]
}

class Ranker extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = this.getStateFromProps();
  }

  componentDidUpdate() {
    if (!shallowArrayEq(this.state.candidatesFromProps, this.props.candidates)) {
      this.setState(this.getStateFromProps())
    }
  }

  getStateFromProps(): State {
    const candidates = this.props.candidates.map(c => {
      return {
        name: c,
        yPos: 0,
      }
    })
    return {
      candidatesFromProps: this.props.candidates,
      orderedCandidates: candidates
    }
  }

  onDragCandidate(key: string, dragInfo: CandidateDragInfo) {
    const oldIndex = this.state.orderedCandidates.findIndex(c => c.name === key)
    var newIndex = this.state.orderedCandidates.findIndex(c => c.yPos > dragInfo.y)
    if (newIndex < 0) {
      newIndex = this.state.orderedCandidates.length - 1
    }

    if (oldIndex !== newIndex) {
      const nextState = this.getNextState(oldIndex, newIndex)
      this.setState(nextState)
    }
  }

  getNextState(oldIndex: number, newIndex: number): {orderedCandidates: RankerCandidateRef[]} {
    const order = [...this.state.orderedCandidates]
    order.splice(newIndex, 0, order.splice(oldIndex, 1)[0])
    return {
      orderedCandidates: order
    }
  }

  render() {
    return (
      <div className="candidate-list" >
        {this.state.orderedCandidates.map((candidate: {name: string, yPos: number}) => (
          <Candidate
            key={candidate.name}
            name={candidate.name}
            onDrag={(d) => this.onDragCandidate(candidate.name, d)}
            onDragEnd={() => this.onCandidateDrop()}
            onProvideY={y =>
              candidate.yPos = y
            }
          />
        ))}
      </div>
    );
  }

  onCandidateDrop() {
    this.props.onUpdateCandidates(this.state.orderedCandidates.map(c => c.name))
  }
}

export default Ranker;
