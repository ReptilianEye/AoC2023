import run from "aocrunner"
interface Line {
  springs: string
  counts: number[]
}
const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => {
      // const springs = line[0].split("")
      const counts = line[1].split(",").map((v) => parseInt(v))
      return <Line>{ springs: line[0], counts: counts }
    })

const replaceAt = (
  source: string,
  startIndex: number,
  replacement: string,
  count = 1,
) => {
  var rep = new Array(count + 1).join(replacement)
  return (
    source.substring(0, startIndex) +
    rep +
    source.substring(startIndex + rep.length)
  )
}
const checkIfCorrect = (springs: string, counts: number[]) => {
  const connected = springs.split(".").filter((v) => v.length > 0)
  if (connected.length != counts.length) return false
  for (let i = 0; i < counts.length; i++)
    if (connected[i].length != counts[i]) {
      return false
    }
  return true
}
const canPlace = (springs: string, start: number, howManyToFill: number) => {
  if (start > 0 && springs[start - 1] === "#") return false
  var i = start
  while (i < start + howManyToFill) {
    if (i == springs.length) return false
    if (springs[i] === ".") return false
    i++
  }
  if (i < springs.length && springs[i] === "#") return false
  return true
}
const comb = ({ springs, counts }: Line) => {
  const combRec = (
    springs: string,
    springsIt: number,
    countsIt: number,
  ): number => {
    if (countsIt == counts.length) {
      if (springs.substring(springsIt + 1).includes("#")) return 0
      springs = replaceAt(springs, springsIt, ".", springs.length - springsIt)
      springsIt = springs.length
    }
    while (springsIt < springs.length && springs[springsIt] === ".") springsIt++
    if (springsIt == springs.length) {
      if (checkIfCorrect(springs, counts)) {
        return 1
      } else return 0
    }
    var ifPlaced = 0
    var ifNotPlaced = 0

    if (canPlace(springs, springsIt, counts[countsIt]))
      ifPlaced = combRec(
        replaceAt(springs, springsIt, "#", counts[countsIt]),
        springsIt + counts[countsIt],
        countsIt + 1,
      )

    if (springs[springsIt] === "?")
      ifNotPlaced = combRec(
        replaceAt(springs, springsIt, ".", 1),
        springsIt + 1,
        countsIt,
      )

    return ifPlaced + ifNotPlaced
  }
  return combRec(springs, 0, 0)
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((acc, line) => {
    return acc + solve(line)
  }, 0)
}
const multiplyLine = ({ springs, counts }: Line) => {
  var springsArr = []
  var countsArr = []
  for (let i = 0; i < 5; i++) {
    springsArr.push(springs)
    countsArr.push(...counts)
  }
  return { springs: springsArr.join("?"), counts: countsArr }
}
const canPlaceV2 = (springs: string, start: number, howManyToFill: number) => {
  var i = start
  while (i > start - howManyToFill) {
    if (i < 0) return false
    if (springs[i] === ".") return false
    i--
  }
  if (i > 0 && springs[i] === "#") return false
  return true
}
const solve = ({ springs, counts }: Line) => {
  springs = "." + springs
  counts = [0, ...counts]
  const m = springs.length
  const n = counts.length

  const dp = new Array(n)
    .fill(-Infinity)
    .map(() => new Array(m).fill(-Infinity))
  for (let i = 0; i < m; i++) {
    if (springs[i] === "#") break
    dp[0][i] = 1
  }
  var sumOfReq = 0
  // console.log(dp[0])

  for (let i = 1; i < n; i++) {
    sumOfReq += counts[i]
    console.log(sumOfReq)
    for (let j = sumOfReq; j < m; j++) {
      var ifPlaced
      if (canPlaceV2(springs, j, counts[i])) {
        if (springs[j - counts[i]] === ".") ifPlaced = dp[i - 1][j - counts[i]]
        else ifPlaced = dp[i - 1][j - counts[i] - 1]
      } else ifPlaced = -Infinity
      // if (j - counts[i] - 1 < 0 || springs[j - counts[i]] === "#") ifPlaced = -Infinity
      // else if (canPlace() springs[j - counts[i]] === ".")
      //   ifPlaced = dp[i - 1][j - counts[i]]
      // else {
      //   if (j - counts[i] - 1 >= 0) ifPlaced = dp[i - 1][j - counts[i] - 1]
      //   else ifPlaced = -Infinity
      // }
      var ifNotPlaced = j >= 0 ? dp[i][j - 1] : -Infinity
      if (springs[j] === "#") dp[i][j] = ifPlaced
      else if (springs[j] === ".") dp[i][j] = ifNotPlaced
      else {
        if (ifNotPlaced === -Infinity) ifNotPlaced = 0
        if (ifPlaced === -Infinity) ifPlaced = 0
        dp[i][j] = ifPlaced + ifNotPlaced
      }
      // console.log(i, j, ifPlaced, ifNotPlaced)
    }
    sumOfReq++
    // console.log(dp[i])
  }
  return dp[n - 1][m - 1]
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map((line) => multiplyLine(line))
  // console.log(input[5].springs, input[5].counts)
  // solve(input[4])
  return input.reduce((acc, line, i) => {
    // console.log("rozpoczynam", i)
    // console.log(line.springs, line.counts)
    // let r = solve(line)
    // console.log("zakonczylem", i, r)
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
