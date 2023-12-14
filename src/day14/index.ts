import run from "aocrunner"
import { calcResult, move, stepBack, validPos } from "./func.js"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""))

enum Side {
  North,
  West,
  South,
  East,
}
const Sides: Side[] = Object.values(Side).filter(
  (v) => typeof v !== "string",
) as Side[]

const next = (side: Side) => Sides[(Sides.indexOf(side) + 1) % Sides.length]
const getStep = (side: Side) => {
  switch (side) {
    case Side.North:
      return [-1, 0]
    case Side.West:
      return [0, -1]
    case Side.South:
      return [1, 0]
    case Side.East:
      return [0, 1]
  }
}
const moveRocksSides = (map: string[][], start: number[], side: Side) => {
  const [row, col] = start
  const dir = getStep(side)
  var pos = move(start, dir)
  for (; validPos(map, pos); pos = move(pos, dir)) {
    if (map[pos[0]][pos[1]] !== ".") break
  }
  if (!validPos(map, pos)) {
    pos = stepBack(pos, dir)
  } else if (pos.toString() !== start.toString() && map[pos[0]][pos[1]] !== ".")
    pos = stepBack(pos, dir)
  ;[map[row][col], map[pos[0]][pos[1]]] = [map[pos[0]][pos[1]], map[row][col]]
}

const moveMapToSide = (map: string[][], side: Side) => {
  const start = (() => {
    switch (side) {
      case Side.North:
        return [0, map[0].length - 1]
      case Side.West:
        return [0, 0]
      case Side.South:
        return [map.length - 1, 0]
      case Side.East:
        return [map.length - 1, map[0].length - 1]
    }
  })()
  const mainStep = stepBack([0, 0], getStep(side))
  const helpStep = getStep(next(side))
  for (let pos = start; validPos(map, pos); pos = move(pos, mainStep))
    for (
      let helpPos = pos;
      validPos(map, helpPos);
      helpPos = move(helpPos, helpStep)
    ) {
      if (map[helpPos[0]][helpPos[1]] === "O") {
        moveRocksSides(map, helpPos, side)
      }
    }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  moveMapToSide(input, Side.North)
  return calcResult(input)
}
const saveMap = (map: string[][]) => map.map((line) => line.join("")).join("")
const splitMap = (map: string, m: number) => {
  const re = new RegExp(`.{1,${m}}`, "g")
  return (map.match(re) as string[]).map((line) => line.split(""))
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const m = input[0].length
  const vis: { [linear: string]: number } = {}
  const maps: string[] = []
  const k = 1000000000
  for (let it = 0; it < k; it++) {
    const linearMap = saveMap(input)
    maps.push(linearMap)
    if (linearMap in vis) {
      const cycleStart = vis[linearMap]
      const cycleLength = it - cycleStart
      const dropStart = k - cycleStart
      const rest = dropStart % cycleLength
      return calcResult(splitMap(maps[cycleStart + rest], m))
    }
    vis[linearMap] = it
    for (let side of Sides) {
      moveMapToSide(input, side)
    }
  }
}
run({
  part1: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
