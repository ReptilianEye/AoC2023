import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map((pattern) => pattern.split("\n").map((row) => row.split("")))

const getRow = (map: string[][], row: number) => map[row].join("")
const getCol = (map: string[][], col: number) =>
  map.map((row) => row[col]).join("")

const myEquals = (str1: string, str2: string) => {
  var diff = []
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) diff.push(i)
  }
  return diff
}

const checkLinesPart1 = (map: string[][], columns: boolean) => {
  const n = columns ? map[0].length : map.length
  const getLine = columns ? getCol : getRow
  var it = 0
  while (it < n - 1) {
    if (getLine(map, it) === getLine(map, it + 1)) {
      var i = it - 1
      var j = it + 1 + 1
      while (i >= 0 && j < n) {
        if (getLine(map, i) !== getLine(map, j)) break
        i--
        j++
      }
      if (i == -1 || j == n) return it + 1
    }
    it++
  }
  return 0
}
const checkLinesPart2 = (
  map: string[][],
  columns: boolean,
  alreadyFixedOriginal: string[] = [],
) => {
  const n = columns ? map[0].length : map.length
  const getLine = columns ? getCol : getRow
  var alreadyFixed = alreadyFixedOriginal
  var it = 0
  const canContinue = (diff: number[], alreadyFixed: string[]) => {
    if (diff.length == 0) return { equals: true, alreadyFixed }
    if (diff.length == 1) {
      let possibleChanges = [
        [it, diff[0]],
        [it + 1, diff[0]],
      ]
        .map((val) => (columns ? val.reverse() : val))
        .map((val) => val.toString())
      if (alreadyFixed.length == 0) {
        alreadyFixed = possibleChanges
        return { equals: true, alreadyFixed }
      }
      if (possibleChanges.some((pos) => alreadyFixed.includes(pos)))
        return { equals: true, alreadyFixed }
    }
    return { equals: false, alreadyFixed }
  }
  while (it < n - 1) {
    alreadyFixed = alreadyFixedOriginal
    var diff = myEquals(getLine(map, it), getLine(map, it + 1))
    var { equals, alreadyFixed: change } = canContinue(diff, alreadyFixed)
    if (equals) {
      alreadyFixed = change
      console.log(getLine(map, it), getLine(map, it + 1), alreadyFixed)
      var i = it - 1
      var j = it + 2
      while (i >= 0 && j < n) {
        diff = myEquals(getLine(map, i), getLine(map, j))
        let { equals, alreadyFixed: change } = canContinue(diff, alreadyFixed)
        if (!equals) break
        alreadyFixed = change
        i--
        j++
      }
      if (alreadyFixed.length == 2 && (i == -1 || j == n))
        return { sol: it + 1, alreadyFixed }
    }
    it++
  }
  return { sol: 0, alreadyFixed: [] }
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  // console.log(
  //   "🚀 ~ file: index.ts:59 ~ part1 ~ checkColumns(input[0]):",
  //   checkLinesPart1(input[1]),
  // )
  return input.reduce(
    (acc, pattern) =>
      acc +
      checkLinesPart1(pattern, false) * 100 +
      checkLinesPart1(pattern, true),
    0,
  )
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { sol: row, alreadyFixed: fix } = checkLinesPart2(input[1], false)
  const col = checkLinesPart2(input[1], true, fix)
  console.log("🚀 ~ file: index.ts:149 ~ part2 ~ row:", row)
  console.log("🚀 ~ file: index.ts:151 ~ part2 ~ col:", col)
  return input.reduce((acc, pattern) => {
    const { sol: row, alreadyFixed: alreadyFixed } = checkLinesPart2(
      pattern,
      false,
    )
    const { sol: col } = checkLinesPart2(pattern, true, alreadyFixed)
    return acc + col + row * 100
  }, 0)
}

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
