export type Ballot = {
  name: string,
  id: string,
  rankings: string[],
  timestamp: number
}

export type Poll = {
  id: string,
  description: string,
  candidates: string[],
};

export type GetPollResponse = {
  poll: Poll,
  ballots: Ballot[]
}

async function createPoll(key: string, description: string, options: string[]) {
  return fetch("/api/polls", {
    headers: {
      "content-type": "application/json",
      "X-VOTE-SECRET": key
    },
    method: "POST",
    body: JSON.stringify({
      description: description,
      candidates: options
    })
  }).then(r => r.json());
}

async function postBallot(key: string, pollId: string, ballotId: string, name: string, rankings: string[]) {
  return fetch(`/api/polls/${pollId}/ballots/${ballotId}`, {
    headers: {
      "content-type": "application/json",
      "X-VOTE-SECRET": key
    },
    method: "PUT",
    body: JSON.stringify({
      name: name,
      rankings: rankings
    })
  });
}

async function getPoll(pollId: string): Promise<?GetPollResponse> {
  let response = await fetch(`/api/polls/${pollId}`, {
    headers: {
      "content-type": "application/json"
    }
  })
  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
}

export { createPoll, postBallot, getPoll };
