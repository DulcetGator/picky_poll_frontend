export const poll = {
  description: 'Where should the convention be held?',
  candidates: [
    {name: 'Seattle', description: null},
    {name: 'Portland', description: null},
    {name: 'San Francisco', description: null},
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

const convention = {
  poll,
  ballots,
}

export default convention