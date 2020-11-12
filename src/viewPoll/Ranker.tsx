import React, { Component } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { Card } from 'react-bootstrap'
import {shallowArrayEq} from '../util/array'
import "./Ranker.css";

type CandidateProps = {
  name: string,
  index: number,
};

type CandidateState = {
};

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
        <Draggable
          draggableId={this.props.name}
          index={this.props.index}>
            {provided =>
              <div
                className={"candidate"}
                ref = {provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                <Card>
                  {this.props.name}
                </Card>
              </div>
            }
        </Draggable>
      </div>
    );
  }
}

type Props = {
  candidates: string[],
  onUpdateCandidates: (cs: string[]) => void
};

type State = {
  orderedCandidates: string[]
}

class Ranker extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = this.getStateFromProps()
  }

  componentDidUpdate() {
    if (!shallowArrayEq(this.state.orderedCandidates, this.props.candidates)) {
      this.setState(this.getStateFromProps())
    }
  }

  getStateFromProps(): State {
    return {
      orderedCandidates: [...this.props.candidates]
    }
  }

  render() {
    return (
      <div className="candidate-list" >
        <DragDropContext
          onDragEnd={dropResult => this.handleCandidateDrop(dropResult)}>
          <Droppable droppableId="candidate-list-droppable">
            { provided =>
              <div
                ref = {provided.innerRef}
                {...provided.droppableProps}>
                {this.props.candidates.map((candidate, i) => (
                  <Candidate
                    key={candidate}
                    name={candidate}
                    index = {i}
                  />
                ))}
                {provided.placeholder}
              </div>
            }
          </Droppable>
        </DragDropContext>
      </div>
    );
  }

  handleCandidateDrop(result: DropResult) {
    if (!result.destination) {
      return
    }
    
    this.state.orderedCandidates.splice(
      result.destination.index,
      0,
      this.state.orderedCandidates.splice(result.source.index, 1)[0])
    this.props.onUpdateCandidates(this.state.orderedCandidates)
  }
}

export default Ranker;
