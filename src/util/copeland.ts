type CopelandPairwiseResult = {
  competitor: string,
  votes: number,
  competitorVotes: number
}

type CopelandRanking = {
  ranking: number,
  winCount: number,
  candidates: {
    candidate: string,
    wins: CopelandPairwiseResult[]
  }[]
}

export function copeland(ballots: string[][]): CopelandRanking[] {

  const candidates = Array.from(
    new Set(ballots.flat(1))
  )

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

    const unseen: Set<string> = new Set(ballot);

    ballot.forEach((prefered) => {
      unseen.delete(prefered);

      Array.from(unseen.keys()).forEach(spurned => {
        singleVotePrefs[prefered][spurned]++
      })
    })
  })

  const pairwiseWins: {[id: string] : CopelandPairwiseResult[]} = {};
  candidates.forEach(c => pairwiseWins[c] = [])

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
      } else if (cb_votes > ca_votes) {
        pairwiseWins[cb].push(
          {
            competitor: ca,
            votes: cb_votes,
            competitorVotes: ca_votes
          }
        )
      }

    })
  })

  const winnersByWinCount: {[id: number]: {candidate: string, wins: CopelandPairwiseResult[]}[]} = {}
  Object.entries(pairwiseWins).forEach(([candidate, result]) => {
    const winCount = result.length
    if (!winnersByWinCount[winCount]) {
      winnersByWinCount[winCount] = []
    }
    winnersByWinCount[winCount].push(
      {
        candidate: candidate,
        wins: result
      }
    )
  })

  const results = Object
    .entries(winnersByWinCount)
    .map(([count, candidates]) => {
      return {
        winCount: +count,
        candidates: candidates
      }
    })

  results.reverse();

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