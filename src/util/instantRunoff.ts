export type InstantRunoffRound = {
  candidateCounts: {
    count: number,
    candidates: Set<string>
  }[]
}

export type InstantRunoffResult = {
  winners: Set<string>,
  rounds: InstantRunoffRound[],
}

function countVotes(
  candidates: string[],
  ballots: string[][]
) {

  const validCandidates: Set<string> = new Set(candidates)
  const firstEligibleChoice: string[] = ballots.flatMap(ballot => {
    const eligible = ballot.filter(candidate => validCandidates.has(candidate))
    return eligible.length > 0 ? [eligible[0]] : []
  })

  const initialCandidateCounts: Map<string, number> = new Map(
    candidates.map(c => [c, 0])
  )
  firstEligibleChoice.forEach(c =>
    initialCandidateCounts.set(c, (initialCandidateCounts.get(c) || 0) + 1)
  )

  const rankings: Map<number, Set<string>> = new Map()
  Array.from(initialCandidateCounts).forEach(([candidate, count]) => {
    if (rankings.has(count)) {
      (rankings.get(count) as Set<string>).add(candidate)
    } else {
      rankings.set(count, new Set([candidate]))
    }
  })

  return Array.from(rankings).map(([count, candidates]) => {
    return {count: count, candidates: candidates}
  }).sort((a, b) => (a.count - b.count))
}

function explainStvRec(
  priorPhases: InstantRunoffRound[],
  candidates: string[],
  ballots: string[][],
): InstantRunoffRound[] {
  const candidateCounts = countVotes(
    candidates,
    ballots
  )
  if (candidateCounts.length === 0) {
    return priorPhases
  } else {
    const eliminated = new Set<string>()
    candidateCounts[0].candidates.forEach(c =>
      eliminated.add(c)
    )
    const nextPhase: InstantRunoffRound = {
      candidateCounts: candidateCounts,
    }
    priorPhases.splice(priorPhases.length, 0, nextPhase)
    return explainStvRec(
      priorPhases,
      candidates.filter(c => !eliminated.has(c)),
      ballots
    )
  }
}

export function instantRunoff(ballots: string[][]): InstantRunoffResult {
  const allCandidates: string[] = Array.from(new Set(ballots
    .flat()
    .sort()
  ).values())

  const rounds = explainStvRec([], allCandidates, ballots)
  let winners = new Set<string>()
  if (rounds.length > 0) {
    winners = rounds[rounds.length - 1].candidateCounts[0].candidates
  }
  return {
    winners: winners,
    rounds: rounds,
  }
}
