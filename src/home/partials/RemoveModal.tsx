import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { KnownPoll } from '../../userIdentity'

import './RemoveModal.css'

type Props = {
  poll: KnownPoll,
  onHide: () => void,
  onOk: () => void,
}

export function RemoveModal(props: Props) {
  const warning = props.poll.isMine
  ? <>
    <p>
      The poll will still exist until it expires, and anyone with the secret
      link can still view it.
    </p>
    <p>
      Nobody else can manage the poll.
    </p>
  </>
  : <p>Your ballot will not be cancelled.</p>
  
  return <Modal className="RemoveModal" show={true} onHide={() => props.onHide()}>
    <Modal.Body>
      <p>
        Remove 
        <span className="remove-modal-poll-description">
          &nbsp;"{props.poll.poll.description}"&nbsp;
        </span>
         from this list?
      </p>
      {warning}
      <Button variant="secondary" onClick={_ => props.onHide()}>
        Cancel
      </Button>
      <Button variant="danger" onClick={_ => props.onOk()}>
        Remove
      </Button>
    </Modal.Body>
  </Modal>
}