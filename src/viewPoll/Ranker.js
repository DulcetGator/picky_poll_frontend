import React, { Component } from "react";
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
  card: ?HTMLElement;

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
          ref={c => this.card=c}
          draggable
          onDragStart={e => this.onDragStart(e)}
        >
          {this.props.name}
        </div>
      </div>
    );
  }

  getCenter(): { x: number, y: number } {
    let current = this.card;
    if (current != null) {
      let boundingRect = current.getBoundingClientRect();
      let x = boundingRect.left + boundingRect.width / 2;
      let y = boundingRect.top + boundingRect.height / 2;
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
  candidates: string[],
  onUpdateCandidates: (string[]) => void
};

type State = {};

class Ranker extends Component<Props, State> {
  candidateRefs: (?Candidate)[];

  constructor(props: Props) {
    super(props);
    let rankedCandidates = props.candidates.slice(0);
    this.candidateRefs = rankedCandidates.map(_ => null);
    this.state = {};
  }

  render() {
    return (
      <div
        className="candidate-list"
        onDrop={e => this.onDrop(e)}
        onDragOver={e => e.preventDefault()}
      >
        {this.props.candidates.map((candidate: string, index: number) => (
          <Candidate
            name={candidate}
            bottomMarker={true}
            ref={c => this.candidateRefs[index]=c}
            onStopDragging={e => {
              this.onStopDraggingCandidate(index, e);
            }}
          />
        ))}
      </div>
    );
  }

  onDrop(e: DragEvent) {
    let draggedFromIndex = this.candidateRefs.findIndex(
      c => c!= null && c.wasDragged(e)
    );
    if (draggedFromIndex >= 0) {
      let draggedToIndex = this.getNewPosition(e);
      let remainingCandidates = this.props.candidates
        .slice(0, draggedFromIndex)
        .concat(this.props.candidates.slice(draggedFromIndex + 1));
      remainingCandidates.splice(
        draggedToIndex <= draggedFromIndex
          ? draggedToIndex
          : draggedToIndex - 1,
        0,
        this.props.candidates[draggedFromIndex]
      );
      this.props.onUpdateCandidates(remainingCandidates);
    } else {
      console.log("something else dropped.");
      console.log(e.target);
    }
  }

  onStopDraggingCandidate(candidateIndex: number, e: MouseEvent) {}

  getNewPosition(e: DragEvent) {
    let centerYs = this.candidateRefs.map(r => {
      if (r != null) {
        return r.getCenter().y;
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
