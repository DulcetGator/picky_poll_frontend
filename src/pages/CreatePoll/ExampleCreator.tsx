import React from 'react'

import { Button, Modal } from 'react-bootstrap'
import { createPoll, postBallot, Poll } from '../../api'
import { IdentityService } from '../../userIdentity'
import crypto from 'crypto';
import promiseTimeout from '../../util/promiseTimeout'
import scenario from '../../util/scenarios/convention'
import BasicSpinner from '../../partials/BasicSpinner';
import { Redirect } from 'react-router-dom';

import './ExampleCreator.css'

type Props = {
  identity: IdentityService,
  children: React.ReactNode,
}

type GenerationState = {
  status: "none",
} | {
  status: "busy",
} | {
  status: "done",
  poll: Poll
}

export default function ExampleCreator(props: Props) {
  const [show, setShow] = React.useState<boolean>(false)
  const [generateState, setGenerateState] = React.useState<GenerationState>({status: 'none'})

  async function generateExample() {

    setGenerateState({status: 'busy'})

    const minWait = promiseTimeout(500)

    const poll = await createPoll(
      props.identity.getKey(),
      "Example poll",
      scenario.poll.description,
      scenario.poll.candidates,
      {
        writeIns: false,
      },
    )
    
    const ballotSubmissions = scenario.ballots.map(b =>
      postBallot(
        crypto.randomBytes(16).toString('hex'),
        poll.id,
        crypto.randomBytes(16).toString('hex'),
        b.name,
        b.ballot,
      )
    )

    await Promise.all(ballotSubmissions)
    await minWait;

    props.identity.addKnownPoll(poll, true)
    setGenerateState({
      status: 'done',
      poll: poll,
    })
  }

  const spinnerClass = generateState.status === 'none'
    ? 'hide-spinner'
    : ''

  const redirect = generateState.status === 'done'
    ? (
      <Redirect to={`/polls/${generateState.poll.id}`} />
    )
    : ''

  return (
    <div className="ExampleCreator" >
      <Modal show={show} onHide={ () => setShow(false)} className="ExampleCreator ExampleCreatorModal">
        <Modal.Body>
          <p className="example-explanation">
            Generate an example poll, including some candidates and voters.
            Afterwards, it will behave just like any other poll on Picky Poll.
          </p>
          <div className={`spinner-placeholder ${spinnerClass}`}>
            <BasicSpinner>Generating...</BasicSpinner>
          </div>
          {redirect}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button
            disabled={generateState.status !== 'none'}
            onClick={generateExample}
            >Generate</Button>
        </Modal.Footer>
      </Modal>
      <div className="activator"
        onClick={ () => setShow(true) }>
        {props.children}
      </div>
    </div>
  )
}