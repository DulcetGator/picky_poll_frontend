import { copeland } from './copeland';

function uniqueCandidates(ballots: string[][]) {
  return Array.from(new Set(ballots.flat(1)))
}

test('given empty list of ballots, returns empty list of rankings', () => {
  const result = copeland([], []);
  expect(result).toStrictEqual([]);
});

test('when candidate does not appear on any ballots, that candidate loses', () => {
  const result = copeland(['winner', 'loser'], [['winner']]);
  expect(result[0].candidates[0].candidate).toEqual('winner');
  expect(result[1].candidates[0].candidate).toEqual('loser');
});

test('given two ballots with different 1st choice, returns tie', () => {
  const ballots: string[][] = [
    ['Vanilla', 'Chocolate'],
    ['Chocolate', 'Vanilla'],
  ];
  const result = copeland(uniqueCandidates(ballots), ballots);
  expect(result.length).toEqual(1);
  expect(result[0].score).toEqual(0);
  expect(Array.from(result[0].candidates.map(c => c.candidate)).sort())
    .toEqual(['Vanilla', 'Chocolate'].sort());
});

test('when there is a 1st-place tie, ranks the next candidate 3rd', () => {
  const ballots = [
    ['Vanilla', 'Chocolate', 'Strawberry'],
    ['Chocolate', 'Vanilla', 'Strawberry'],
  ];
  const result = copeland(uniqueCandidates(ballots), ballots);
  expect(result.length).toEqual(2)
  expect(result[0].score).toEqual(1)
  expect(result[0].candidates.map(c => c.candidate).sort())
    .toEqual(['Vanilla', 'Chocolate'].sort())
});

test('in Tennessee scenario, selects Nashville (Condorcet winner)', () => {
  const memphis = 'm', nashville = 'n', chattanooga='c', knoxville='k'
  const data: [number, string[]][] = [
    [ 42, [memphis, nashville, chattanooga, knoxville]],
    [ 26, [nashville, chattanooga, knoxville, memphis]],
    [ 15, [chattanooga, knoxville, nashville, memphis]],
    [ 17, [knoxville, chattanooga, nashville, memphis]],
  ]
  const ballots = data.flatMap(([count, ballot]) =>
    new Array(count).fill(ballot)
  )

  const results = copeland(uniqueCandidates(ballots), ballots)
  expect(results.map(r => r.candidates[0].candidate))
    .toEqual([nashville, chattanooga, knoxville, memphis])
})