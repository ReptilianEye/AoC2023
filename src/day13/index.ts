import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map((pattern) => pattern.split("\n").map((row) => row.split("")))

const getRow = (map: string[][], row: number) => map[row].join("")
const getCol = (map: string[][], col: number) =>
  map.map((row) => row[col]).join("")

const calcDiff = (str1: string, str2: string) => {
  var diff = 0
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) diff++
  }
  return diff
}

const checkLines = (map: string[][], columns: boolean, diffQuery: number) => {
  const n = columns ? map[0].length : map.length
  const getLine = columns ? getCol : getRow
  var it = 0
  while (it < n - 1) {
    var i = it
    var j = it + 1
    var diff = 0
    while (i >= 0 && j < n) {
      diff += calcDiff(getLine(map, i), getLine(map, j))
      i--
      j++
    }
    if (diff == diffQuery) return it + 1
    it++
  }
  return 0
}

const part1 = (rawInput: string, diffKey = 0) => {
  const input = parseInput(rawInput)
  return input.reduce(
    (acc, pattern) =>
      acc +
      checkLines(pattern, false, diffKey) * 100 +
      checkLines(pattern, true, diffKey),
    0,
  )
}
const part2 = (rawInput: string) => part1(rawInput, 1)

run({
  part1: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
