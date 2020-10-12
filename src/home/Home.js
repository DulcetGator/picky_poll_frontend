import React, {type Node} from 'react'
import { Link } from 'react-router-dom'
import { ListPolls } from '../listPolls/ListPolls'

export default function Home(): Node {
  return (
    <div>
      <ListPolls />
      <Link to='/create' >
        <p>Create a new poll</p>
      </Link>
    </div>
  );
}