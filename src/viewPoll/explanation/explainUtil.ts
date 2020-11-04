export type StvExplainPhase = {
  candidateCounts: {
    count: number,
    candidates: Set<string>
  }[]
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
  priorPhases: StvExplainPhase[],
  candidates: string[],
  ballots: string[][],
): StvExplainPhase[] {
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
    const nextPhase: StvExplainPhase = {
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

export function explainStv(ballots: string[][]): StvExplainPhase[] {
  const allCandidates: string[] = Array.from(new Set(ballots
    .flat()
    .sort()
  ).values())

  return explainStvRec([], allCandidates, ballots)
}