import run from "aocrunner"
import {
  distanceABS as distance,
  move,
  substract,
  validPos,
} from "../help_func.js"
import PriorityQueue from "../dataStructures/FastPriorityQueue.js"
import { BarrierPoint, SortedArray } from "./dumbSortedArray.js"
import { Point } from "./Point.js"
import { Pair, PairType } from "./Pair.js"
const directions: { [key: string]: number[] } = {
  R: [0, 1],
  L: [0, -1],
  U: [-1, 0],
  D: [1, 0],
}
const moveNTimes = (coord: number[], direction: string, distance: number) => {
  const step = directions[direction].map((x) => x * distance)
  return move(coord, step)
}
const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(" "))

const parsePart1 = (parsed: string[][]) => {
  var prev = [0, 0]
  const mapped = [] as number[][]
  for (let line of parsed) {
    const [direction, distance] = line
    const coord = [...prev]
    const next = moveNTimes(coord, direction, parseInt(distance))
    prev = [...next]
    mapped.push(prev)
  }
  return mapped
}
interface Vector2d {
  coord: number[]
  color: string
}
const findBounds = (input: number[][]) => {
  const topLeft = (vec1: number[], vec2: number[]) => [
    Math.min(vec1[0], vec2[0]),
    Math.min(vec1[1], vec2[1]),
  ]

  const bottomRight = (vec1: number[], vec2: number[]) => [
    Math.max(vec1[0], vec2[0]),
    Math.max(vec1[1], vec2[1]),
  ]
  const first = input[0]
  return input.reduce(
    (acc, vec) => {
      return {
        topLeft: topLeft(acc.topLeft, vec),
        bottomRight: bottomRight(acc.bottomRight, vec),
      }
    },
    {
      topLeft: first,
      bottomRight: first,
    },
  )
}
const saveAsGrid = (input: number[][]) => {
  const bounds = findBounds(input)
  const height = bounds.bottomRight[0] - bounds.topLeft[0] + 1
  const width = bounds.bottomRight[1] - bounds.topLeft[1] + 1
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "."),
  )
  var prev = substract(input[input.length - 1], bounds.topLeft)
  for (let vec of input) {
    const vec0 = substract(vec, bounds.topLeft)
    const step = substract(vec0, prev).map((x) =>
      x != 0 ? Math.floor(x / Math.abs(x)) : 0,
    )
    while (prev.toString() !== vec0.toString()) {
      grid[prev[0]][prev[1]] = "#"
      prev = move(prev, step)
    }
  }

  return grid
}
const cutBarriersOddTimes = (originalMap: string[][], start: number[]) => {
  const countBarriersSpecific = (direction: number, horizonally: boolean) => {
    var cutted = 0
    const step = horizonally ? [0, direction] : [direction, 0]
    var [i, j] = start
    var prev = "#"
    for (; validPos(originalMap, [i, j]); [i, j] = move([i, j], step)) {
      const v = originalMap[i][j]
      if (!isNaN(parseInt(v))) {
        if (isNaN(parseInt(prev)) || Math.abs(parseInt(v) - parseInt(prev)) > 1)
          cutted++
      }
      prev = v
    }
    return cutted
  }
  const dirSpec = [-1, 1]
  const orientSpec = [true, false]
  for (let dir of dirSpec)
    for (let orient of orientSpec)
      if (countBarriersSpecific(dir, orient) % 2 == 1) return true
  return false
}
const fillInner = (grid: string[][], start: number[]) => {
  const Q = [start]
  while (Q.length > 0) {
    const v = Q.pop()
    if (v == undefined) return
    const [i, j] = v
    grid[i][j] = "#"
    for (let dir of Object.values(directions)) {
      const next = move(v, dir)
      if (validPos(grid, next) && grid[next[0]][next[1]] === ".") {
        Q.push(next)
      }
    }
  }
}
const part1 = (rawInput: string) => {
  const input = parsePart1(parseInput(rawInput))
  const grid = saveAsGrid(input)
  grid.forEach((line) => console.log(line.join("")))
  fillInner(grid, [Math.floor(grid.length / 2), Math.floor(grid[0].length / 2)])
  return grid.reduce(
    (acc, line) => acc + line.filter((v) => v === "#").length,
    0,
  )
}

const parseColor = (color: string) => {
  const directionsFromNum: { [key: number]: string } = {
    0: "R",
    1: "D",
    2: "L",
    3: "U",
  }
  color = color.substring(2, color.length - 1)
  const distance = parseInt(color.substring(0, 5), 16)
  const direction = directionsFromNum[parseInt(color.substring(5, 6))]
  return { direction, distance }
}
const parsePart2 = (parsed: string[][]) => {
  var prev = [0, 0]
  const mapped = [] as number[][]
  for (let line of parsed) {
    const { direction, distance } = parseColor(line[line.length - 1])
    const coord = [...prev]
    const next = moveNTimes(coord, direction, distance)
    prev = [...next]
    mapped.push(prev)
  }
  return mapped
}
const normalize = (vectors: number[][]) => {
  const { topLeft } = findBounds(vectors)
  return vectors.map((vec) => substract(vec, topLeft))
}

const next = (i: number, n: number) => (i + 1) % n
const prev = (i: number, n: number) => (i - 1 + n) % n

const connect = (vectors: number[][]) => {
  const n = vectors.length
  const nodeMap = new Map<number[], Point>()
  const nodes = vectors.map((vec) => new Point(vec, []))
  const pairs = []
  for (let i = 0; i < n; i++) {
    const node = nodes[i]
    const nextPoint = nodes[next(i, n)]
    const prevPoint = nodes[prev(i, n)]
    console.log(prevPoint.coord, node.coord, nextPoint.coord)
    node.nbours = [nextPoint, prevPoint]
    nodeMap.set(node.coord, node)
  }
  for (let i = 0; i < n; i++) {
    const node = nodes[i]
    const nextPoint = nodes[next(i, n)]
    if (node.coord[0] === nextPoint.coord[0]) {
      pairs.push(new Pair(node, nextPoint))
    }
  }
  return { nodeMap, pairs }
}
const comparePair = (a: Pair, b: Pair) => {
  if (a.row != b.row) return a.row < b.row
  return (
    Math.min(...a.pair.map((n) => n.coord[0])) <
    Math.min(...b.pair.map((n) => n.coord[0]))
  )
}
const calcSurface = (a: number[], b: number[]) =>
  (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1)
const solve = (nodeMap: Map<number[], Point>, pairs: Pair[]) => {
  var Surface = 0
  const Q = new PriorityQueue<Pair>(comparePair)
  pairs.forEach((pair) => Q.add(pair))
  var T = new SortedArray()

  while (!Q.isEmpty()) {
    const top = Q.poll()
    if (top == undefined) throw new Error("queue is empty")

    const { type } = top
    console.log(top.col1, top.col2, top.row)
    console.log(T.arr.map((x) => [...x.coord, x.innerSide]))
    if (type === PairType.START) {
      T.add(new BarrierPoint([top.row, top.col1], "right"))
      T.add(new BarrierPoint([top.row, top.col2], "left"))
      // T.add([top.x2, top.y])
    } else if (type === PairType.END) {
      T.remove(top.col1)
      T.remove(top.col2)
    } else if (type === PairType.CONNECT) {
      const connectedToHigher = top.getConnectedToHigher()
      console.log("connectedToHigher: ", connectedToHigher)
      const otherSide = connectedToHigher.getOtherSide(T)
      if (otherSide != undefined) {
        console.log("other side: ", otherSide)
        Surface +=
          calcSurface(connectedToHigher.coord, otherSide.coord) -
          Math.abs(connectedToHigher.coord[1] - otherSide.coord[1]) +
          1
        console.log("surface: ", Surface)
        otherSide.updateRow(top.row)
      } else {
        console.log("nie ma drugiej strony")
      }
      const sameSide = connectedToHigher.getSameSide(T)
      console.log("same side: ", sameSide)
      T.replace(sameSide, top.getConnectedToLower().coord)
    }
  }
  return Surface
}
const part2 = (rawInput: string) => {
  const input = parsePart1(parseInput(rawInput))
  // const input = parsePart2(parseInput(rawInput))
  const normalized = normalize(input)
  const { nodeMap, pairs } = connect(normalized)
  const surface = solve(nodeMap, pairs)
  return surface
  // console.log(normalized)

  return
}

run({
  part1: {
    tests: [
      {
        input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
