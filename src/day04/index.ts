import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) =>
    line
      .split(":")[1]
      .split("|")
      .map((draw) =>
        draw
          .split(" ")
          .map((el) => parseInt(el))
          .filter((val) => !Number.isNaN(val)),
      ),
  )
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((acc, line) => {
    const winningSet = line[0].reduce(
      (winning, current) => winning.add(current),
      new Set(),
    )
    const matches = line[1].reduce(
      (wonSoFar, current) => wonSoFar + (winningSet.has(current) ? 1 : 0),
      0,
    )
    if (matches == 0) return acc
    return acc + Math.pow(2, matches - 1)
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const n = input.length
  const CopiesCounts = Array(n).fill(1)
  const incrementWonCards = (start: number, howManyWon: number) => {
    const inc = CopiesCounts[start]
    const range = Array(howManyWon)
      .fill(0)
      .map((_, i) => i + start + 1)
    range.forEach((i) => {
      CopiesCounts[i] += inc
    })
  }
  input.forEach((line, i) => {
    const winningSet = line[0].reduce(
      (winning, current) => winning.add(current),
      new Set(),
    )
    const matches = line[1].reduce(
      (wonSoFar, current) => wonSoFar + (winningSet.has(current) ? 1 : 0),
      0,
    )
    if (matches > 0) incrementWonCards(i, matches)
  })
  return CopiesCounts.reduce((acc, curr) => acc + curr, 0)
}

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
