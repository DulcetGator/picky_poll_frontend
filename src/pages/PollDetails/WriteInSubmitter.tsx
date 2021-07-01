import React, { Component } from 'react';
import {
  Alert, Button, Form, Row,
} from 'react-bootstrap';
import { Candidate, Poll, postCandidate } from '../../api';
import BasicSpinner from '../../partials/BasicSpinner'
import promiseTimeout from '../../util/promiseTimeout';

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
  description: string,
  isSubmitting: boolean,
  error?: string
};

const newState = {
    name: "",
    description: "",
    isSubmitting: false,
    error: undefined,
};

export default class WriteInSubmitter extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = Object.assign({}, newState);
    }

    async submit() {
        this.setState(Object.assign({}, this.state, {isSubmitting: true}));

        const description = this.state.description && this.state.description.trim() ? this.state.description.trim() : null;
        const minWaitPromise = promiseTimeout(200);
        const result = await postCandidate(this.props.poll.id, {
            name: this.state.name,
            description: description,
        });
        await minWaitPromise;
        if (result.ok) {
            this.setState(Object.assign({}, newState));
        } else if (result.status == 409 /*conflict*/) {
            this.setState(Object.assign({}, this.state, {isSubmitting: false, error: `A candidate named '${this.state.name}' already exists.`}));
        } else {
            console.error({msg: "Unexpected error creating candidate", currentState: this.state, response: result, responseBody: await result.json()});
            this.setState(Object.assign({}, this.state, {isSubmitting: false, error: 'Unexpected error.'}));
        }
    }

    render() {
        return (
            <div className="WriteInSubmitter">
                <Form>
                    {this.errorElement()}
                    <Form.Group as={Row} controlId="candidateNameInput">
                        <Form.Control
                            placeholder="New candidate name"
                            value={this.state.name}
                            onChange={(e) => this.handleNameChange(e.currentTarget.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Control
                            placeholder="(Optional) Candidate description"
                            as="textarea"
                            rows={2}
                            value={this.state.description}
                            onChange={(e) => this.handleDescriptionChange(e.currentTarget.value)}
                        />
                    </Form.Group>
                    <Button disabled={this.state.isSubmitting} onClick={() => this.submit()}>
                        {this.buttonContent()}
                    </Button>
                </Form>
            </div>
        );
    }

    handleNameChange(newName: string) {
        this.setState(Object.assign({}, this.state, {name: newName}))
    }

    handleDescriptionChange(newDescription: string) {
        this.setState(Object.assign({}, this.state, {description: newDescription}));
    }

    buttonContent() {
        return this.state.isSubmitting ? <BasicSpinner /> : "New Candidate"
    }

    errorElement() {
        return this.state.error ?
            <Alert variant="danger">{this.state.error}</Alert> :
            null;
    }
}