import run from "aocrunner"
import { link } from "fs"

const parseInput = (rawInput: string) => {
  const gameSplit = rawInput.split("\n").map((line) => line.trim().split(":"))
  const rounds = gameSplit.map((line) =>
    line[line.length - 1].split(";").map((round) =>
      round
        .split(",")
        .map((one) => one.trim().split(" "))
        .map(
          (roundSplitted) =>
            <Drawn>{
              count: parseInt(roundSplitted[0]),
              color: roundSplitted[1],
              // }
            },
        ),
    ),
  )
  return rounds
}
interface Drawn {
  count: number
  color: string
}
interface Limit {
  [color: string]: number
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const limits: Limit = { red: 12, green: 13, blue: 14 }
  const isGameCorrect = (game: Drawn[][]) =>
    !game.some((round) =>
      round.some((drawn) => limits[drawn.color] < drawn.count),
    )
  return input.reduce(
    (acc, game, i) => (isGameCorrect(game) ? acc + i + 1 : acc),
    0,
  )
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const getGamePower = (game: Drawn[][]) => {
    const limits: Limit = game.reduce(
      (gameMinSet: Limit, round) =>
        round.reduce(
          (roundMinSet, drawn) =>
            <Limit>{
              ...roundMinSet,
              [drawn.color]: Math.max(roundMinSet[drawn.color], drawn.count),
            },
          gameMinSet,
        ),
      {
        red: 0,
        green: 0,
        blue: 0,
      },
    )
    return Object.values(limits).reduce((acc, curr) => acc * curr, 1)
  }

  return input.reduce((acc, game) => acc + getGamePower(game), 0)
}

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
                Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
                Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
                Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
                Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
