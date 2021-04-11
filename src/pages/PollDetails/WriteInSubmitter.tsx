import React, { Component } from 'react';
import {
  Button, Form, FormControl, Row,
} from 'react-bootstrap';
import { Candidate, Poll, } from '../../api';

import './WriteInSubmitter.css'

// import BasicSpinner from '../../partials/BasicSpinner';
// import promiseTimeout from '../../util/promiseTimeout';


type Props = {
  poll: Poll,
  candidates: Map<string, Candidate>,
  onNewCandidate: (candidate: Candidate) => void
};

type State = {
  name: string,
  isSubmitting: boolean,
};

export default class WriteInSubmitter extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            isSubmitting: false,
        };
    }

    render() {
        return (
            <div className="WriteInSubmitter">
                <Form>
                    <Form.Group as={Row} controlId="candidateNameInput">
                        <FormControl
                            placeholder="New candidate name"
                            value={this.state.name}
                            onChange={(e) => this.handleNameChange(e.currentTarget.value)}
                        />
                    </Form.Group>
                    <Button>New Candidate</Button>
                </Form>
            </div>
        );
    }

    handleNameChange(newName: string) {
        this.setState({name: newName})
    }
}