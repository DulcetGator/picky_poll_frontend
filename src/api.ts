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
  close: string,
  expires: string
};

export type GetPollResponse = {
  poll: Poll,
  ballots: Ballot[]
}

async function createPoll(key: string, description: string, options: string[]): Promise<Poll> {
  const response = await fetch('/api/polls', {
    headers: {
      'content-type': 'application/json',
      'X-VOTE-SECRET': key,
    },
    method: 'POST',
    body: JSON.stringify({
      description,
      candidates: options,
    }),
  })
  return response.json()
}

async function postBallot(key: string, pollId: string, ballotId: string, name: string, rankings: string[])
: Promise<Response> {
  return await fetch(`/api/polls/${pollId}/ballots/${ballotId}`, {
    headers: {
      'content-type': 'application/json',
      'X-VOTE-SECRET': key,
    },
    method: 'PUT',
    body: JSON.stringify({
      name,
      rankings,
    }),
  });
}

async function getPoll(pollId: string): Promise<GetPollResponse | null> {
  const response = await fetch(`/api/polls/${pollId}`, {
    headers: {
      'content-type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  }
  return null;
}

export { createPoll, postBallot, getPoll };
