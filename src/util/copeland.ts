export type CopelandPairwiseResult = {
  competitor: string,
  votes: number,
  competitorVotes: number
}

export type CopelandRanking = {
  ranking: number,
  score: number,
  candidates: {
    candidate: string,
    wins: CopelandPairwiseResult[]
  }[]
}

export function copeland(candidates: string[], ballots: string[][]): CopelandRanking[] {

  const candidatesSet = new Set(candidates);
  ballots.flat(1)
    .filter(c => !candidatesSet.has(c))
    .forEach(c => {
      throw `Unexpected candidate ${c}`
    })

  const singleVotePrefs: {
    [id: string]: {
      [id: string]: number
    }
  } = {}

  candidates.forEach(a => {
    singleVotePrefs[a] = {}
    candidates.forEach(b => {
      singleVotePrefs[a][b] = 0
    })
  })

  ballots.forEach(ballot => {

    const unseen: Set<string> = new Set(candidates);

    ballot.forEach((prefered) => {
      unseen.delete(prefered);

      Array.from(unseen.keys()).forEach(spurned => {
        singleVotePrefs[prefered][spurned]++
      })
    })
  })

  const scores: {[id: string] : number} = {}
  const pairwiseWins: {[id: string] : CopelandPairwiseResult[]} = {};
  candidates.forEach(c => {
    pairwiseWins[c] = []
    scores[c] = 0
  })

  candidates.forEach((ca, ca_idx) => {
    candidates.slice(ca_idx + 1).forEach((cb) => {
      const ca_votes: number = singleVotePrefs[ca][cb]
      const cb_votes: number = singleVotePrefs[cb][ca]

      if (ca_votes > cb_votes) {
        pairwiseWins[ca].push(
          {
            competitor: cb,
            votes: ca_votes,
            competitorVotes: cb_votes
          }
        )
        scores[ca]++
        scores[cb]--
      } else if (cb_votes > ca_votes) {
        pairwiseWins[cb].push(
          {
            competitor: ca,
            votes: cb_votes,
            competitorVotes: ca_votes
          }
        )
        scores[cb]++
        scores[ca]--
      }
    })
  })

  const winnersByScore: {[id: number]: {candidate: string, wins: CopelandPairwiseResult[]}[]} = {}
  Object.entries(scores).forEach(([candidate, score]) => {
    if (!winnersByScore[score]) {
      winnersByScore[score] = []
    }
    winnersByScore[score].push(
      {
        candidate: candidate,
        wins: pairwiseWins[candidate]
      }
    )
  })

  const results = Object
    .entries(winnersByScore)
    .map(([score, candidates]) => {
      return {
        score: +score,
        candidates: candidates
      }
    })

  results.sort((a, b) => (+b.score) - (+a.score))

  let ranking = 1;
  return results.map(r => {
    const retVal: CopelandRanking = {
      ...r,
      ranking: ranking
    }
    ranking += r.candidates.length
    return retVal;
  })
}