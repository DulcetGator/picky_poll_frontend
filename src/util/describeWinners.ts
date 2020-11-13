export function describeWinners(isClosed: boolean, winners: Set<string>) {
  const winnersArray = Array.from(winners);
  if (isClosed) {
    if (winnersArray.length <= 1) {
      return `Winner: ${winnersArray[0]}`;
    } if (winnersArray.length <= 2) {
      return `Winners (tied): ${winnersArray.join(', ')}`;
    }
    return `Winner: ${winnersArray.length}-way tie`;
  }
  if (winnersArray.length <= 1) {
    return `Current winner: ${winnersArray[0]}`;
  } if (winnersArray.length <= 2) {
    return `Current winners (tied): ${winnersArray.join(', ')}`;
  }
  return `Current winner: ${winnersArray.length}-way tie`;
}
