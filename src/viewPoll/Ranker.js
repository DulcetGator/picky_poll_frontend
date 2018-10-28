import React, { Component } from "react";
import type { Ref } from "react";
import "./Ranker.css";

type CandidateProps = {
  name: string,
  bottomMarker: boolean,
  onStopDragging: MouseEvent => void
};

type CandidateState = {
  isDragging: boolean
};

class Candidate extends Component<CandidateProps, CandidateState> {
  card = React.createRef();

  constructor(props: CandidateProps) {
    super(props);
    this.state = {
      isDragging: false
    };
  }

  render() {
    let bottomMarkerClass = this.props.bottomMarker ? "bottom-marker " : "";
    return (
      <div className={"candidate-wrapper " + bottomMarkerClass}>
        <div
          className={"candidate"}
          ref={this.card}
          draggable
          onDragStart={e => this.onDragStart(e)}
        >
          {this.props.name}
        </div>
      </div>
    );
  }

  getCenter(): { x: number, y: number } {
    let current = this.card.current;
    if (current) {
      let boundingRect = current.getBoundingClientRect();
      let x = boundingRect.x + boundingRect.width / 2;
      let y = boundingRect.y + boundingRect.height / 2;
      return { x: x, y: y };
    } else {
      throw new Error("Ref not set");
    }
  }

  onDragStart(e: DragEvent) {
    if (e.dataTransfer) {
      e.dataTransfer.setData("candidate", this.props.name);
    } else {
      throw Error("No dataTransfer");
    }
  }

  wasDragged(e: DragEvent) {
    return (
      e.dataTransfer && e.dataTransfer.getData("candidate") === this.props.name
    );
  }
}

type Props = {
  candidates: string[]
};

type State = {
  rankedCandidates: string[]
};

class Ranker extends Component<Props, State> {
  candidateRefs: Ref<typeof Candidate>[];

  constructor(props: Props) {
    super(props);
    let rankedCandidates = props.candidates.slice(0);
    this.candidateRefs = rankedCandidates.map(_ => React.createRef());
    this.state = {
      rankedCandidates: rankedCandidates
    };
  }

  render() {
    return (
      <div
        className="candidate-list"
        onDrop={e => this.onDrop(e)}
        onDragOver={e => e.preventDefault()}
      >
        {this.state.rankedCandidates.map((candidate: string, index: number) => {
          return (
            <Candidate
              name={candidate}
              bottomMarker={true}
              ref={this.candidateRefs[index]}
              onStopDragging={e => {
                this.onStopDraggingCandidate(index, e);
              }}
            />
          );
        })}
      </div>
    );
  }

  onDrop(e: DragEvent) {
    let draggedFromIndex = this.candidateRefs.findIndex(
      c => c.current && (c.current: any).wasDragged(e)
    );
    if (draggedFromIndex >= 0) {
      let draggedToIndex = this.getNewPosition(e);
      let remainingCandidates = this.state.rankedCandidates
        .slice(0, draggedFromIndex)
        .concat(this.state.rankedCandidates.slice(draggedFromIndex + 1));
      remainingCandidates.splice(
        draggedToIndex <= draggedFromIndex
          ? draggedToIndex
          : draggedToIndex - 1,
        0,
        this.state.rankedCandidates[draggedFromIndex]
      );
      this.setState({
        rankedCandidates: remainingCandidates
      });
    } else {
      console.log("something else dropped.");
      console.log(e.target);
    }
  }

  onStopDraggingCandidate(candidateIndex: number, e: MouseEvent) {}

  getNewPosition(e: DragEvent) {
    let centerYs = this.candidateRefs.map(r => {
      if (r.current) {
        return ((r.current: any): Candidate).getCenter().y;
      } else {
        throw new Error("");
      }
    });

    let firstIndex = centerYs.findIndex(y => e.clientY < y);
    if (firstIndex < 0) {
      return centerYs.length;
    }
    return firstIndex;
  }
}

export default Ranker;
