export const poll = {
  description: 'Where should the convention be held?',
  candidates: [
    'Seattle',
    'Portland',
    'San Francisco',
  ]
}

export const ballots = [
  {
    home: 'Seattle',
    voters: [
      'Ada',
      'Charles',
      'Edsger',
    ],
    ballot: ['Seattle', 'Portland', 'San Francisco']
  }, {
    home: 'Portland',
    voters: [
      'محمد',
      'Alan',
    ],
    ballot: ['Portland', 'Seattle', 'San Francisco']
  }, {
    home: 'San Francisco',
    voters: [
      '培肃',
      'Haskell',
      'Barbara',
      'George',
    ],
    ballot: ['San Francisco', 'Portland', 'Seattle']
  }
].flatMap(d =>
  d.voters.map(name => {
    return {
      name: `${name} from ${d.home}`,
      ballot: d.ballot
    }
  })
)

export default {
  poll,
  ballots,
}