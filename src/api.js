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

function getPoll(pollId: string): Promise<Poll> {
  return fetch(`/polls/${pollId}`, {
    headers: {
      "content-type": "application/json"
    }
  }).then(r => r.json());
}

export { createPoll, getPoll };
