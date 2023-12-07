import run from "aocrunner"
import { CardsStrengths, compareHands1 } from "./part1Func.js"
import { compareHands2 } from "./part2Func.js"
import { Card, Hand } from "./func.js"

const parseHand = (rawHand: string) =>
  rawHand.split("").map(
    (val) =>
      <Card>{
        symbol: val,
        strength: val in CardsStrengths ? CardsStrengths[val] : parseInt(val),
      },
  )

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" "))
    .map(([hand, bid]) => <Hand>{ cards: parseHand(hand), bid: parseInt(bid) })

const part1 = (rawInput: string) => {
  var hands = parseInput(rawInput)
  hands = hands.sort(compareHands1)
  return hands.reduce((s, { bid }, i) => s + bid * (i + 1), 0)
}

const part2 = (rawInput: string) => {
  var hands = parseInput(rawInput)
  hands = hands.sort(compareHands2)
  return hands.reduce((s, { bid }, i) => s + bid * (i + 1), 0)
}

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
