import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(":")[1])
    .map((line) =>
      line
        .trim()
        .split(" ")
        .map((val) => parseInt(val))
        .filter((num) => !isNaN(num)),
    )

const part1 = (rawInput: string) => {
  const [times, distances] = parseInput(rawInput)
  const countWinning = (time: number, distance: number) =>
    Array(time)
      .fill(0)
      .map((_, i) => i)
      .reduce(
        (won, startTime) =>
          won + ((time - startTime) * startTime > distance ? 1 : 0),
        0,
      )
  return times.reduce(
    (won, time, i) => won * countWinning(time, distances[i]),
    1,
  )
}

const part2 = (rawInput: string) => {
  const [time, distance] = parseInput(rawInput)
    .map((line) => line.join(""))
    .map((val) => parseInt(val))

  const getFirstWinning = (
    time: number,
    distance: number,
    direction: number,
  ) => {
    var startTime = direction == 1 ? 0 : time
    while (true) {
      if ((time - startTime) * startTime > distance) return startTime
      startTime += direction
    }
  }
  return (
    getFirstWinning(time, distance, -1) - getFirstWinning(time, distance, 1) + 1
  )
}

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
