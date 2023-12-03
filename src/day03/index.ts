import run from "aocrunner"
import { parseInput } from "./functions.js"
import { checkIfHasSymbolNbour } from "./part1Functions.js"
import { appendNearStars, fillStars, starsDict } from "./part2Functions.js"

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput)
  return map.reduce((acc, line, row) => {
    let matches = [...line.matchAll(/[0-9]+/g)]
    return (
      acc +
      matches.reduce((lineSum, match) => {
        let [foundNumber, index] = [match[0], match.index]
        if (index == null) {
          console.log("err")
          return lineSum
        }
        return (
          lineSum +
          (checkIfHasSymbolNbour(row, index, foundNumber.length, map)
            ? parseInt(foundNumber)
            : 0)
        )
      }, 0)
    )
  }, 0)
}

const part2 = (rawInput: string) => {
  const map = parseInput(rawInput)
  const stars: starsDict = {}
  fillStars(stars, map)

  map.forEach((line, row) => {
    let matches = [...line.matchAll(/[0-9]+/g)]
    matches.forEach((match) => {
      let [foundNumber, index] = [match[0], match.index]
      if (index == null) {
        console.log("err")
        return
      }
      appendNearStars(row, index, foundNumber, map, stars)
    })
  })
  return Object.keys(stars).reduce(
    (acc, currentStar) =>
      stars[currentStar].length == 2
        ? acc +
          stars[currentStar].reduce(
            (prev, currentNumber) => prev * parseInt(currentNumber),
            1,
          )
        : acc,
    0,
  )
}

run({
  part1: {
    tests: [
      {
        input: `467..114..
                ...*......
                ..35..633.
                ......#...
                617*......
                .....+.58.
                ..592.....
                ......755.
                ...$.*....
                .664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
                ...*......
                ..35..633.
                ......#...
                617*......
                .....+.58.
                ..592.....
                ......755.
                ...$.*....
                .664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
