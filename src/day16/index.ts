import run from "aocrunner"
import { move, substract, validPos } from "../help_func.js"
const makeArrayOfSets = (n: number, m: number) => {
  var arr = [] as Set<String>[][]
  for (let i = 0; i < n; i++) {
    arr[i] = []
    for (let j = 0; j < m; j++) {
      arr[i][j] = new Set()
    }
  }
  return arr
}
type MapElement = "." | "-" | "|" | "/" | "J"
const moves = {
  ".": [],
  "|": [
    [-1, 0],
    [1, 0],
  ],
  "-": [
    [0, -1],
    [0, 1],
  ],
  "/": [
    [
      [0, -1],
      [-1, 0],
    ],
    [
      [0, 1],
      [1, 0],
    ],
  ],
  J: [
    [
      [0, -1],
      [1, 0],
    ],
    [
      [0, 1],
      [-1, 0],
    ],
  ],
}

const getNbours = (map: MapElement[][], pos: number[], prev: number[]) => {
  let el = map[pos[0]][pos[1]]
  let prevUnitVec = substract(prev, pos)
  switch (el) {
    case ".":
      return [substract(pos, prev)]
    case "/":
    case "J": {
      let nb = moves[el]
      for (let n of nb) {
        let i = n.findIndex((v) => v.toString() === prevUnitVec.toString())
        if (i !== -1) return [n[1 - i]]
      }
      throw new Error("Invalid map")
    }
    case "|":
    case "-": {
      let nb = moves[el]
      let i = nb.findIndex((n) => n.toString() === prevUnitVec.toString())
      if (i !== -1) return [nb[1 - i]]
      return nb
    }
  }
}
const dfs = (map: string[][], start: number[], startPrev: number[]) => {
  const dfs_rec = (pos: number[], prev: number[]) => {
    if (vis[pos[0]][pos[1]].has(prev.toString())) return
    vis[pos[0]][pos[1]].add(prev.toString())
    for (let nb of getNbours(map as MapElement[][], pos, prev)) {
      let newPos = move(pos, nb)
      if (validPos(map, newPos)) dfs_rec(newPos, pos)
    }
  }
  const vis = makeArrayOfSets(map.length, map[0].length)
  dfs_rec(start, startPrev)
  return vis.reduce(
    (acc, line) =>
      acc + line.reduce((accL, s) => (s.size > 0 ? accL + 1 : accL), 0),
    0,
  )
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""))
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return dfs(input, [0, 0], [0, -1])
}
enum Side {
  Top,
  Right,
  Bottom,
  Left,
}
const getSideData = (
  map: string[][],
  side: Side,
): { start: number[]; startPrev: number[]; limit: number } => {
  const n = map.length
  const m = map[0].length
  switch (side) {
    case Side.Top:
      return { start: [0, NaN], startPrev: [-1, NaN], limit: m }
    case Side.Right:
      return { start: [NaN, 0], startPrev: [NaN, -1], limit: n }
    case Side.Bottom:
      return { start: [n - 1, NaN], startPrev: [n, NaN], limit: m }
    case Side.Left:
      return { start: [NaN, m - 1], startPrev: [NaN, m], limit: n }
  }
}
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const sides = Object.values(Side).slice(4) as Side[]
  var max = 0
  for (let side of sides) {
    const { start, startPrev, limit } = getSideData(input, side)
    for (let i = 0; i < limit; i++) {
      let startDFS = start.map((v) => (isNaN(v) ? i : v)) as number[]
      let startPrevDFS = startPrev.map((v) => (isNaN(v) ? i : v)) as number[]
      max = Math.max(max, dfs(input, startDFS, startPrevDFS))
    }
  }
  return max
}

run({
  part1: {
    tests: [
      {
        input: `.|...J....
|.-.J.....
.....|-...
........|.
..........
.........J
..../.JJ..
.-.-/..|..
.|....-|.J
..//.|....`,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.|...J....
|.-.J.....
.....|-...
........|.
..........
.........J
..../.JJ..
.-.-/..|..
.|....-|.J
..//.|....`,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
