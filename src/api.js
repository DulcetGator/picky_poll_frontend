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

export { createPoll };
