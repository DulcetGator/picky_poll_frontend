import React from 'react'
import { Link } from 'react-router-dom'
import { About } from '../about/About';
import { ListPolls } from '../list/ListPolls'
import IdentityContext from '../userIdentity';

export default function Home() {
  const context = React.useContext(IdentityContext)
  if ((context.getKnownPolls() || []).length > 0) {
    return <ListPolls />
  } else {
    return <About />
  }
}