import run from "aocrunner"
import { move, substract, validPos } from "../help_func.js"
import PriorityQueue from "./FastPriorityQueue.js"

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
const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split("").map((digit) => parseInt(digit)))

const getNborsPart1 = (map: number[][], curr: Path) => {
  const { prev, pos, stepsInSameDirection } = curr
  const stepBack = substract(prev, pos)
  const stepForward = substract(pos, prev)
  const base = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]
  return base
    .filter((v) => v.toString() !== stepBack.toString())
    .filter(
      (v) =>
        stepsInSameDirection < 3 || v.toString() !== stepForward.toString(),
    )
}
const distanceToTheEdge = (
  pos: number[],
  direction: number[],
  map: number[][],
) => {
  let distance = 0
  while (validPos(map, pos)) {
    pos = move(pos, direction)
    distance++
  }
  return distance
}
const getNborsPart2 = (map: number[][], curr: Path) => {
  const { prev, pos, stepsInSameDirection } = curr
  const stepBack = substract(prev, pos)
  const stepForward = substract(pos, prev)
  // if (pos.toString() === [11, 12].toString())
  //   console.log(
  //     "forward",
  //     prev,
  //     pos,
  //     stepForward,
  //     "steps:",
  //     stepsInSameDirection,
  //   )
  const base = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]
  if (pos.toString() === [0, 0].toString()) return base
  if (stepsInSameDirection < 4) return [stepForward]
  return base
    .filter((v) => v.toString() !== stepBack.toString())
    .filter(
      (v) =>
        stepsInSameDirection < 10 || v.toString() !== stepForward.toString(),
    )
    .filter(
      (v) =>
        v.toString() === stepForward.toString() ||
        distanceToTheEdge(pos, v, map) > 4,
    )
}
interface Path {
  pos: number[]
  prev: number[]
  stepsInSameDirection: number
  cost: number
  path: number[][]
}
const compare = (a: Path, b: Path) => a.cost < b.cost
const mapToString = (pos: number[]) => {
  switch (pos.toString()) {
    case "0,1":
      return ">"
    case "1,0":
      return "v"
    case "0,-1":
      return "<"
    case "-1,0":
      return "^"
  }
}
const printPath = (map: number[][], path: number[][]) => {
  path.unshift([0, 0])
  var mapStr = map.map((line) => line.map((v) => v.toString()))
  path.forEach((pos) => {
    mapStr[pos[0]][pos[1]] = "#"
  })
  mapStr.forEach((line) => {
    console.log(line.join(""))
  })
}
const dijkstra = (
  map: number[][],
  getNbors: (map: number[][], curr: Path) => number[][],
) => {
  const start = [0, 0]
  const end = [map.length - 1, map[0].length - 1]
  const vis = makeArrayOfSets(map.length, map[0].length)
  const Q = new PriorityQueue<Path>(compare)
  var i = 0
  const sols = []
  Q.add({
    pos: start,
    prev: [Infinity, Infinity],
    stepsInSameDirection: 0,
    cost: 0,
    path: [],
  })
  while (!Q.isEmpty()) {
    let top = Q.poll()
    if (top == undefined) throw new Error("queue is empty")
    const { pos, prev, stepsInSameDirection, cost } = top

    if (pos.toString() === end.toString()) {
      // top.path.forEach((p) => {
      //   console.log(p)
      // })
      // printPath(map, top.path)
      return cost
      sols.push(top)
      // return cost
    }
    if (vis[pos[0]][pos[1]].has([...prev, stepsInSameDirection].toString()))
      continue
    // if (prev.toString() === [10, 12].toString())
    //   console.log(prev, pos, stepsInSameDirection, cost, getNbors(map, top))
    i++
    // if (i == 100) return
    vis[pos[0]][pos[1]].add([...prev, stepsInSameDirection].toString())
    for (let nb of getNbors(map, top)) {
      let newPos = move(pos, nb)
      if (!validPos(map, newPos)) continue
      Q.add({
        pos: newPos,
        prev: pos,
        stepsInSameDirection:
          nb.toString() === substract(pos, prev).toString()
            ? stepsInSameDirection + 1
            : 1,
        cost: cost + map[newPos[0]][newPos[1]],
        path: [...top.path, newPos],
      })
    }
  }
  // sols.forEach((s) => {
  //   console.log(s.cost)
  //   printPath(map, s.path)
  // })
  return Math.min(...sols.map((s) => s.cost))
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return dijkstra(input, getNborsPart1)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return dijkstra(input, getNborsPart2)
}

run({
  part1: {
    tests: [
      {
        input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 94,
      },
      {
        input: `111111111111
999999999991
999999999991
999999999991
999999999991`,
        expected: 71,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
