import React, { ReactNode } from 'react';
import { Spinner } from 'react-bootstrap';

import './BasicSpinner.css'

type Props = {
  children?: ReactNode
}

export default function BasicSpinner(props: Props) {
  return (
    <Spinner className="BasicSpinner" animation="border" role="status">
      <span className="sr-only">{props.children}</span>
    </Spinner>
  )
}