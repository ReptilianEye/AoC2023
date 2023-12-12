import run from "aocrunner"
import {
  BFSFindBarrier,
  BFSMarkBarrier,
  addGuard,
  countBarriers,
  fillBad,
  getPos,
  max,
  replaceRestWithDot,
  replaceS,
} from "./func.js"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split("").map((v) => (v === "7" ? "T" : v)))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const SPos = getPos(input, "S")
  return max(BFSFindBarrier(input, SPos))
}

const part2 = (rawInput: string) => {
  var map = parseInput(rawInput)
  map = addGuard(map)
  var originalMap: string[][] = []
  for (var i = 0; i < map.length; i++) originalMap[i] = map[i].slice()
  const badFiller = "O"
  const SPos = getPos(map, "S")
  const movesOrder = BFSFindBarrier(map, SPos)
  const endloopPos = getPos(movesOrder, max(movesOrder))
  BFSMarkBarrier(map, endloopPos)
  replaceS(originalMap, map)
  fillBad(map, badFiller)
  originalMap = replaceRestWithDot(originalMap, map, badFiller)
  var sol = 0
  originalMap.forEach((line, i) =>
    line.forEach((v, j) => {
      if (v === ".") {
        if (countBarriers(originalMap, [i, j]).every((v) => v % 2 == 1)) sol++
      }
    }),
  )
  return sol
}

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
