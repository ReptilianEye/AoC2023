import run from "aocrunner"
import { digitFromString } from "./digitsWords.js"

const parseInput = (rawInput: string) => rawInput.split("\n")

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((acc, currentLine) => {
    let digits = currentLine.match(/[1-9]/g)
    if (digits == null) throw Error(`No digits in line ${currentLine}`)
    return (
      acc + (10 * parseInt(digits[0]) + parseInt(digits[digits.length - 1]))
    )
  }, 0)
}
const mapToDigit = (digit: string) =>
  digitFromString[digit] ? digitFromString[digit] : parseInt(digit)

const part2 = (rawInput: string) => {
  const pattern = RegExp(
    "(?=(" + Object.keys(digitFromString).join("|") + "|[1-9]))",
    "g",
  )
  const input = parseInput(rawInput)
  return input.reduce((acc, currentLine) => {
    let digits = Array.from(currentLine.matchAll(pattern), (x) => x[1])
    if (digits == null) throw Error(`No digits in line ${currentLine}`)
    return (
      acc + (10 * mapToDigit(digits[0]) + mapToDigit(digits[digits.length - 1]))
    )
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
