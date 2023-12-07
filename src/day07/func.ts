export interface Card {
  symbol: string
  strength: number
}
export interface Hand {
  cards: Card[]
  bid: number
}

export const Combinations = {
  highCard: 0,
  pair: 100,
  twoPair: 200,
  threeOfAKind: 300,
  fullHouse: 400,
  fourOfAKind: 500,
  fiveOfAKind: 600,
}
export const compareHandsOwn = (
  hand1: Hand,
  hand2: Hand,
  getCompination: (symbols: string[]) => number,
  CardsStrengths: { [symbol: string]: number },
) => {
  const symbols1 = hand1.cards.reduce(
    (soFar, { symbol }) => [...soFar, symbol],
    [] as string[],
  )
  const symbols2 = hand2.cards.reduce(
    (soFar, { symbol }) => [...soFar, symbol],
    [] as string[],
  )
  const compination1 = getCompination(symbols1)
  const compination2 = getCompination(symbols2)

  if (compination1 !== compination2) {
    return compination1 - compination2
  }
  var i = 0
  while (i < 5) {
    if (symbols1[i] !== symbols2[i]) {
      return CardsStrengths[symbols1[i]] - CardsStrengths[symbols2[i]]
    }
    i++
  }
  return 0
}
