import { instantRunoff } from './instantRunoff';

test('given empty list of ballots, returns empty list of phases', () => {
  const result = instantRunoff([]);
  expect(result.rounds).toStrictEqual([]);
  expect(Array.from(result.winners)).toStrictEqual([]);
});

test('given two ballots with different 1st choice, returns tie', () => {
  const ballots: string[][] = [
    ['Vanilla', 'Chocolate'],
    ['Chocolate', 'Vanilla'],
  ];
  const result = instantRunoff(ballots);
  expect(result.rounds.length).toEqual(1);
  expect(result.rounds[0].candidateCounts.length).toEqual(1);
  expect(Array.from(result.winners).sort())
    .toEqual(['Vanilla', 'Chocolate'].sort());
});

test('given ballots, eliminates candidate with no top position', () => {
  const ballots = [
    ['Vanilla', 'Strawberry', 'Chocolate'],
    ['Chocolate', 'Strawberry', 'Vanilla'],
    ['Chocolate', 'Vanilla', 'Strawberry'],
  ];
  const result = instantRunoff(ballots);
  expect(result.rounds.length).toEqual(3);

  expect(Array.from(result.rounds[0].candidateCounts[0].candidates))
    .toEqual(['Strawberry']);

  expect(Array.from(result.rounds[1].candidateCounts[0].candidates))
    .toEqual(['Vanilla']);

  expect(Array.from(result.rounds[2].candidateCounts[0].candidates))
    .toEqual(['Chocolate']);
});
