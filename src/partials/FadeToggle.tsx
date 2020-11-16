import React from 'react'

import './FadeToggle.css'

type Props = {
  children: React.ReactNode,
  show: boolean,
}

export default function FadeToggle(props: Props) {
  const visibilityClass = props.show
    ? "show"
    : "hide"
  return <div className={`FadeToggle ${visibilityClass}`}>
    {props.children}
  </div>
}