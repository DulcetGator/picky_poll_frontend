import React, { MouseEventHandler, Component } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { Alert, Card } from 'react-bootstrap';
import { Candidate } from '../../../api';
import { shallowArrayEq } from '../../../util/array';
import './Ranker.css';

type CandidateDragProps = {
  candidate: Candidate,
  index: number,
  onClick: MouseEventHandler
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
              onClick={(e: React.MouseEvent) => this.props.onClick(e)}
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

enum HintStatus {
  None,
  Show,
  Hide,
}

type Props = {
  candidates: Candidate[],
  onUpdateCandidates: (cs: Candidate[]) => void
};

type State = {
  orderedCandidates: Candidate[],
  hintStatus: HintStatus
}

class Ranker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      orderedCandidates: [...this.props.candidates],
      hintStatus: HintStatus.None
    }
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
          {
            this.hint()
          }
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
                    onClick={e => this.handleClick(e)}
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
    if (this.state.hintStatus == HintStatus.Show) {
      this.setState({hintStatus: HintStatus.Hide});
    }
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

  hint() {
    if (this.state.hintStatus == HintStatus.None) {
      return null;
    }
    const hintClass = this.state.hintStatus == HintStatus.Show ? "ranker-hint-visible" : "ranker-hint-hidden"
    const hintText = this.state.orderedCandidates.length == 1
      ? "There is only one candidate right now, so you can't rank anything yet."
      : "Drag the candidates to rank them from best to worst."
    return <div className={`ranker-hint ${hintClass}`}>
        <Alert variant="info">
            {hintText}
        </Alert>
      </div>;
  }

  handleClick(e: React.MouseEvent) {
    if (!e.defaultPrevented) {
      this.setState({
        hintStatus: HintStatus.Show
      })
    }
  }
}

export default Ranker;
