import run from "aocrunner"
import { Line, canPlace, multiplyLine } from "./func.js"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => {
      const counts = line[1].split(",").map((v) => parseInt(v))
      return <Line>{ springs: line[0], counts: counts }
    })

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((acc, line) => {
    return acc + solve(line)
  }, 0)
}

const solve = ({ springs, counts }: Line) => {
  springs = "." + springs
  counts = [0, ...counts]
  const m = springs.length
  const n = counts.length

  const dp = new Array(n)
    .fill(-Infinity)
    .map(() => new Array(m).fill(-Infinity))

  for (let i = 0; i < m && springs[i] !== "#"; i++) dp[0][i] = 1

  var sumOfReq = 0

  for (let i = 1; i < n; i++) {
    sumOfReq += counts[i]
    for (let j = sumOfReq; j < m; j++) {
      var ifPlaced = ((): number => {
        if (!canPlace(springs, j, counts[i])) return -Infinity
        if (springs[j - counts[i]] === ".") return dp[i - 1][j - counts[i]]
        return dp[i - 1][j - counts[i] - 1]
      })()

      var ifNotPlaced = j >= 0 ? dp[i][j - 1] : -Infinity

      dp[i][j] = ((): number => {
        if (springs[j] === "#") return ifPlaced
        if (springs[j] === ".") return ifNotPlaced
        ifPlaced = Math.max(ifPlaced, 0)
        ifNotPlaced = Math.max(ifNotPlaced, 0)
        return ifPlaced + ifNotPlaced
      })()
    }
    sumOfReq++
  }
  return dp[n - 1][m - 1]
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map((line) => multiplyLine(line))
  return input.reduce((acc, line) => {
    return acc + solve(line)
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
