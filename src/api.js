import {type Identity } from './userIdentity.js'

export type Poll = {
  id: string,
  description: string,
  candidates: string[]
};

function createPoll(identity: Identity, description: string, options: string[]) {
  return fetch("/api/polls", {
    headers: {
      "content-type": "application/json",
      "X-VOTE-SECRET": identity.key
    },
    method: "POST",
    body: JSON.stringify({
      description: description,
      candidates: options
    })
  }).then(r => r.json());
}

function postBallot(pollId: string, name: string, rankings: string[]) {
  return fetch(`/api/polls/${pollId}/vote`, {
    headers: {
      "content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      rankings: rankings
    })
  });
}

async function getPoll(pollId: string): Promise<Poll> {
  let response = await fetch(`/api/polls/${pollId}`, {
    headers: {
      "content-type": "application/json"
    }
  })
  let json = await response.json();
  return json.poll
}

export { createPoll, postBallot, getPoll };
