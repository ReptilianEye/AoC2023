import { Combinations, compareHandsOwn } from "./func.js"

export interface Card {
  symbol: string
  strength: number
}
export interface Hand {
  cards: Card[]
  bid: number
}

export const CardsStrengths: { [symbol: string]: number } = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
}
export const getCompination = (symbols: string[]) => {
  const distincts = new Set(symbols)
  if (distincts.size === 5) return Combinations.highCard
  if (distincts.size === 4) return Combinations.pair
  if (distincts.size === 1) return Combinations.fiveOfAKind

  const counts: { [sym: string]: number } = {}
  for (let sym of distincts) {
    counts[sym] = symbols.filter((val) => val == sym).length
  }
  const countsNumbers = Object.values(counts)

  if (distincts.size === 3) {
    if (countsNumbers.includes(3)) {
      return Combinations.threeOfAKind
    }
    return Combinations.twoPair
  }
  if (distincts.size === 2) {
    if (countsNumbers.includes(4)) return Combinations.fourOfAKind
    return Combinations.fullHouse
  }
  throw Error("hand bigger than expected")
}

export const compareHands1 = (hand1: Hand, hand2: Hand) =>
  compareHandsOwn(hand1, hand2, getCompination, CardsStrengths)
