import run from "aocrunner"
interface Line {
  springs: string[]
  counts: number[]
}
const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => {
      const springs = line[0].split("")
      const counts = line[1].split(",").map((v) => parseInt(v))
      return <Line>{ springs: springs, counts: counts }
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
    // console.log(springs, springsIt, countsIt)
    if (countsIt == counts.length) {
      springs = replaceAt(springs, springsIt, ".", springs.length - springsIt)
      springsIt = springs.length
    }
    while (springsIt < springs.length && springs[springsIt] === ".") springsIt++
    if (springsIt == springs.length) {
      if (!used.has(springs) && checkIfCorrect(springs, counts)) {
        // console.log("dobre bylo,", springs)
        used.add(springs)
        return 1
      } else return 0
    }
    var ifPlaced = 0
    var ifNotPlaced = 0

    if (canPlace(springs, springsIt, counts[countsIt])) {
      // console.log("licze gdy mozna bylo postawic")
      ifPlaced = combRec(
        replaceAt(springs, springsIt, "#", counts[countsIt]),
        springsIt + counts[countsIt],
        countsIt + 1,
      )
    }
    // console.log("licze gdy NIE")
    if (springs[springsIt] === "?") {
      ifNotPlaced = combRec(
        replaceAt(springs, springsIt, ".", 1),
        springsIt + 1,
        countsIt,
      )
    }
    return ifPlaced + ifNotPlaced
  }
  const used: Set<string> = new Set()
  var res = combRec(springs.join(""), 0, 0)
  console.log("dla", counts, "mamy: ", used)
  return used.size
}
const part1 = (rawInput: string) => {
  // console.log(checkIfCorrect("#...###", [1, 1, 3]))
  const input = parseInput(rawInput)
  // return comb(input[5])
  return input.reduce((acc, line) => {
    // console.log(line, "kombinacje ", comb(line))
    return acc + comb(line)
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
