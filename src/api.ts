export type Ballot = {
  name: string,
  id: string,
  rankings: string[],
  timestamp: number
}

export type Poll = {
  id: string,
  name: string,
  description: string,
  candidates: Candidate[],
  close: string,
  expires: string,
  configuration: Configuration
};

export type GetPollResponse = {
  poll: Poll,
  ballots: Ballot[]
}

export type Candidate = {
  name: string,
  description: string | null
}

export type Configuration = {
  writeIns: boolean
}

const voteSecretKey = 'X-VOTE-SECRET'

async function createPoll(key: string,
  name: string,
  description:
  string,
  candidates: Candidate[],
  configuration: Configuration
  ): Promise<Poll> {
  const response = await fetch('/api/polls', {
    headers: {
      'content-type': 'application/json',
      [voteSecretKey]: key,
    },
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      candidates,
      configuration,
    }),
  })
  return response.json()
}

async function postBallot(key: string, pollId: string, ballotId: string, name: string, rankings: string[])
: Promise<Response> {
  return await fetch(`/api/polls/${pollId}/ballots/${ballotId}`, {
    headers: {
      'content-type': 'application/json',
      [voteSecretKey]: key,
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
