import { explainStv, StvExplainPhase } from './explainUtil'

test('given empty list of ballots, returns empty list of phases', () => {
  const result = explainStv([])
  expect(result).toStrictEqual([])
})

test('given two ballots with different 1st choice, returns tie', () => {
  const ballots: string[][] = [
    ['Vanilla', 'Chocolate'],
    ['Chocolate', 'Vanilla']
  ]
  const result = explainStv(ballots)
  expect(result.length).toEqual(1)
  expect(result[0].candidateCounts.length).toEqual(1)
  expect(Array.from(result[0].candidateCounts[0].candidates).sort())
    .toEqual(['Vanilla', 'Chocolate'].sort())
})

test('given ballots, eliminates candidate with no top position', () => {
  const ballots = [
    ['Vanilla', 'Strawberry', 'Chocolate'],
    ['Chocolate', 'Strawberry', 'Vanilla'],
    ['Chocolate', 'Vanilla', 'Strawberry']
  ]
  const result = explainStv(ballots)
  expect(result.length).toEqual(3)

  expect(Array.from(result[0].candidateCounts[0].candidates))
    .toEqual(['Strawberry'])

  expect(Array.from(result[1].candidateCounts[0].candidates))
    .toEqual(['Vanilla'])

  expect(Array.from(result[2].candidateCounts[0].candidates))
    .toEqual(['Chocolate'])
})