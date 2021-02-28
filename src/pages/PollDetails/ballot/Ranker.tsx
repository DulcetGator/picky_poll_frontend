import React, { Component } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { Card } from 'react-bootstrap';
import { Candidate } from '../../../api';
import { shallowArrayEq } from '../../../util/array';
import './Ranker.css';

type CandidateDragProps = {
  candidate: Candidate,
  index: number,
};

type CandidateDragState = {
};

class CandidateDrag extends Component<CandidateDragProps, CandidateDragState> {
  card: HTMLElement | null = null;

  constructor(props: CandidateDragProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="candidate-wrapper">
        <Draggable
          draggableId={this.props.candidate.name}
          index={this.props.index}
        >
          {(provided) => (
            <div
              className="candidate"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Card>
                {this.props.candidate.name}
              </Card>
            </div>
          )}
        </Draggable>
      </div>
    );
  }
}

type Props = {
  candidates: Candidate[],
  onUpdateCandidates: (cs: Candidate[]) => void
};

type State = {
  orderedCandidates: Candidate[]
}

class Ranker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {orderedCandidates: [...this.props.candidates]}
  }

  componentDidUpdate() {
    if (!shallowArrayEq(
      this.state.orderedCandidates,
      this.props.candidates,
    )) {
      this.setState({orderedCandidates: [...this.props.candidates]});
    }
  }

  render() {
    return (
      <div className="candidate-list">
        <DragDropContext
          onDragEnd={(dropResult) => this.handleCandidateDrop(dropResult)}
        >
          <Droppable droppableId="candidate-list-droppable">
            { (provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.props.candidates.map((candidate, i) => (
                  <CandidateDrag
                    key={candidate.name}
                    candidate={candidate}
                    index={i}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }

  handleCandidateDrop(result: DropResult) {
    if (!result.destination) {
      return;
    }

    this.state.orderedCandidates.splice(
      result.destination.index,
      0,
      this.state.orderedCandidates.splice(result.source.index, 1)[0],
    );
    this.props.onUpdateCandidates(this.state.orderedCandidates);
  }
}

export default Ranker;
