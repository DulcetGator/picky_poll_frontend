import React from 'react'
import { Link } from 'react-router-dom'
import { ListPolls } from './ListPolls'

export default function Home() {
  return (
    <>
      <ListPolls />
      <Link to='/create' >
        <p>Create a new poll</p>
      </Link>
    </>
  );
}