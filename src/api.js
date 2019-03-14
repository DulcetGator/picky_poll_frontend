export type Poll = {
  id: string,
  description: string,
  candidates: string[]
};

function createPoll(description: string, options: string[]) {
  return fetch("/polls", {
    headers: {
      "content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      description: description,
      candidates: options
    })
  }).then(r => r.json());
}

function postBallot(pollId: string, name: string, rankings: string[]) {
  return fetch(`/polls/${pollId}/vote`, {
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
  let response = await fetch(`/polls/${pollId}`, {
    headers: {
      "content-type": "application/json"
    }
  })
  let json = await response.json();
  return json.poll
}

export { createPoll, postBallot, getPoll };
