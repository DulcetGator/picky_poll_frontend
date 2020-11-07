export function describeWinners(isClosed: boolean, winners: Set<String>) {
  const winnersArray = Array.from(winners)
  if (isClosed) {
    if (winnersArray.length <= 1) {
      return `Winner: ${winnersArray[0]}`
    } else if (winnersArray.length <= 2) {
      return `Winners (tied): ${winnersArray.join(', ')}`
    } else {
      return `Winner: ${winnersArray.length}-way tie`
    }
  } else {
    if (winnersArray.length <= 1) {
      return `Current winner: ${winnersArray[0]}`
    } else if (winnersArray.length <= 2) {
      return `Current winners (tied): ${winnersArray.join(', ')}`
    } else {
      return `Current winner: ${winnersArray.length}-way tie`
    }
  }
}