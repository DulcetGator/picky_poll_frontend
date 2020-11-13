export function describeWinners(isClosed: boolean, winners: string[]) {
  if (isClosed) {
    if (winners.length <= 1) {
      return `Winner: ${winners[0]}`;
    } if (winners.length <= 2) {
      return `Winners (tied): ${winners.join(', ')}`;
    }
    return `Winner: ${winners.length}-way tie`;
  }
  if (winners.length <= 1) {
    return `Current winner: ${winners[0]}`;
  } if (winners.length <= 2) {
    return `Current winners (tied): ${winners.join(', ')}`;
  }
  return `Current winner: ${winners.length}-way tie`;
}
