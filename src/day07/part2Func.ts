import { Combinations, Hand, compareHandsOwn } from "./func.js"
import { getCompination as getCompinationWithoutJokers } from "./part1Func.js"
export const CardsStrengths: { [symbol: string]: number } = {
  J: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  Q: 12,
  K: 13,
  A: 14,
}
export const getCompinationFour = (symbols: string[]) => {
  const distincts = new Set(symbols)
  if (distincts.size === 4) return Combinations.highCard
  if (distincts.size === 3) return Combinations.pair
  if (distincts.size === 1) return Combinations.fourOfAKind

  const counts: { [sym: string]: number } = {}
  for (let sym of distincts) {
    counts[sym] = symbols.filter((val) => val == sym).length
  }
  const countsNumbers = Object.values(counts)

  if (distincts.size === 2) {
    if (countsNumbers.includes(3)) {
      return Combinations.threeOfAKind
    }
    return Combinations.twoPair
  }
  throw Error("hand bigger than expected")
}

const getCompinationValue = (symbols: string[]) => {
  if (!symbols.includes("J")) return getCompinationWithoutJokers(symbols)

  const jokers = symbols.filter((val) => val === "J").length
  const symbolsWithoutJokers = symbols.filter((val) => val !== "J")
  const distincts = new Set(symbolsWithoutJokers)
  if (jokers === 5 || jokers === 4) return Combinations.fiveOfAKind
  if (jokers === 3) {
    if (distincts.size === 1) return Combinations.fiveOfAKind
    if (distincts.size === 2) return Combinations.fourOfAKind
  }
  if (jokers === 2) {
    if (distincts.size === 1) return Combinations.fiveOfAKind
    if (distincts.size === 2) return Combinations.fourOfAKind
    return Combinations.threeOfAKind
  }
  if (jokers === 1) {
    const combination = getCompinationFour(symbolsWithoutJokers)
    switch (combination) {
      case Combinations.highCard:
        return Combinations.pair
      case Combinations.pair:
        return Combinations.threeOfAKind
      case Combinations.twoPair:
        return Combinations.fullHouse
      case Combinations.threeOfAKind:
        return Combinations.fourOfAKind
      case Combinations.fullHouse:
        return Combinations.fourOfAKind
      case Combinations.fourOfAKind:
        return Combinations.fiveOfAKind
    }
  }
  throw Error("hand bigger than expected")
}

export const compareHands2 = (hand1: Hand, hand2: Hand) =>
  compareHandsOwn(hand1, hand2, getCompinationValue, CardsStrengths)
