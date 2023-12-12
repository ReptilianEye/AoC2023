import run from "aocrunner"
import {
  connections,
  displayMap,
  isBarrier,
  isValBarrier,
  makeArray,
  moves,
  setVal,
  val,
  validPos,
} from "./func.js"
const getPos = (input: any[][], x: any) => {
  var SPos = [0, 0]
  input.some((line, i) =>
    line.some((el, j) => {
      if (el === x) {
        SPos = [i, j]
        return true
      }
      return false
    }),
  )
  return SPos
}
const keys = {
  left: "W",
  right: "E",
  universal: "P",
}
const getConnections = (map: string[][], v: number[]) => {
  if (val(map, v) in connections) return connections[val(map, v) as string]
  return []
}
const move = (start: number[], moveCoord: number[]) => [
  start[0] + moveCoord[0],
  start[1] + moveCoord[1],
]
const substract = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1]]

const areConnected = (map: string[][], pos1: number[], pos2: number[]) => {
  if (
    Object.values(keys).includes(val(map, pos1)) ||
    Object.values(keys).includes(val(map, pos2))
  )
    return false
  return (
    getConnections(map, pos1).some(
      (mv) => mv.toString() === substract(pos2, pos1).toString(),
    ) &&
    getConnections(map, pos2).some(
      (mv) => mv.toString() === substract(pos1, pos2).toString(),
    )
  )
}

const max = (arr: number[][]) =>
  arr.reduce(
    (maxV, line) =>
      Math.max(
        maxV,
        line.reduce((maxInLine, el) => Math.max(el, maxInLine), -1),
      ),
    -1,
  )

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split("").map((v) => (v === "7" ? "T" : v)))

const BFS = (map: string[][], s: number[]) => {
  const n = map.length
  const m = map[0].length
  const movesOrder = makeArray(n, m, 0) as number[][]
  var Q = [s]
  while (Q.length > 0) {
    const v = Q.shift()
    if (v === undefined) throw Error("empty queue")

    for (let mv of getConnections(map, v)) {
      const u = move(v, mv)
      if (
        s.toString() !== u.toString() &&
        val(movesOrder, u) === 0 &&
        areConnected(map, v, u)
      ) {
        setVal(movesOrder, u, val(movesOrder, v) + 1)
        Q.push(u)
      }
    }
  }
  return movesOrder
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const SPos = getPos(input, "S")
  return max(BFS(input, SPos))
}
const BFS2 = (map: string[][], s: number[]) => {
  const start = "10"
  const vis = [s.toString()]
  var Q: { v: number[]; prev: string }[] = [{ v: s, prev: start }]
  while (Q.length > 0) {
    const next = Q.shift()
    if (next === undefined) throw Error("empty queue")
    const { v, prev: dir } = next
    vis.push(v.toString())
    for (let mv of getConnections(map, v)) {
      const u = move(v, mv)
      if (!vis.includes(u.toString()) && areConnected(map, v, u)) {
        Q.push({ v: u, prev: (parseInt(dir) + 1).toString() })
      }
    }
    setVal(map, v, dir)
  }
  setVal(map, s, start)
}
const addGuard = (map: string[][]) => {
  const withGuards = map.map((line) => ["O", ...line, "O"])
  const m = withGuards[0].length
  withGuards.unshift(Array(m).fill("O"))
  withGuards.push(Array(m).fill("O"))
  return withGuards
}

const fillBad = (map: string[][], filler = "O") => {
  const getNbours = (map: string[][], pos: number[]) => {
    return moves
      .map((mv) => {
        const u = move(pos, mv)
        if (!validPos(map, u)) return []
        if (val(map, u) === filler) return []
        if (isBarrier(map, u)) return []
        return u
      })
      .filter((x) => x.length > 0)
  }
  const fill = (s: number[]) => {
    vis.push(s.toString())
    const Q = [s]
    while (Q.length > 0) {
      const v = Q.shift()
      if (v === undefined) throw Error("empty queue")
      setVal(map, v, filler)
      for (let u of getNbours(map, v)) {
        if (!vis.includes(u.toString())) {
          Q.push(u)
          vis.push(u.toString())
        }
      }
    }
  }
  const vis: string[] = []
  map.forEach((line, i) =>
    line.forEach((v, j) => {
      if (v === "O" && !vis.includes([i, j].toString())) {
        fill([i, j])
      }
    }),
  )
}
const connectedByPipe = (map: string[][], pos1: number[], pos2: number[]) => {
  // console.log(
  //   "dla ",
  //   pos1,
  //   pos2,
  //   Math.abs(parseInt(val(map, pos1)) - parseInt(val(map, pos2))),
  // )
  return Math.abs(parseInt(val(map, pos1)) - parseInt(val(map, pos2))) == 1
}
const opposite = (pos: number[]) => {
  return [-pos[0], -pos[1]].map((val) => (val == 0 ? 0 : val))
}

const hasBarriersNbours = (map: string[][], pos: number[]) => {
  const steps = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  return steps.some((step) => isBarrier(map, move(pos, step)))
}
const det = (a: number[], b: number[], c: number[]) => {
  const [ax, ay] = a
  const [bx, by] = b
  const [cx, cy] = c
  return (bx - ax) * (cy - by) - (by - ay) * (cx - bx)
}

const goByBarrier = (
  originalMap: string[][],
  toFill: string[][],
  start: number[],
  filler: string,
) => {
  const getInner = (prev: number[], curr: number[]) => {
    const next = (curr: number[], prev: number[]) => {
      var u: number[] = []
      // console.log(
      //   prev,
      //   curr,
      //   getConnections(originalMap, curr),
      //   val(originalMap, curr),
      // )
      for (let mv of getConnections(originalMap, curr)) {
        u = move(curr, mv)
        if (u.toString() != prev.toString()) return u
      }
      throw Error("u unassigned")
    }
    const getNbours = (a: number[], b: number[], c: number[]) => {
      var nbours
      if (det(a, b, c) == 0) {
        if (a[0] === b[0]) {
          nbours = [
            [b[0] + 1, b[1]],
            [b[0] - 1, b[1]],
          ]
        } else {
          nbours = [
            [b[0], b[1] + 1],
            [b[0], b[1] - 1],
          ]
        }
        return nbours
      } else {
        let cand = [
          [a[0], c[1]],
          [c[0], a[1]],
        ]
        var good
        for (let c of cand) {
          if (c.toString() !== b.toString()) good = c
        }
        if (good === undefined) throw Error("good unassigned")
        const vector = [b[0] - good[0], b[1] - good[1]]
        const second = [b[0] + vector[0], b[1] + vector[1]]
        return [good, second]
      }
    }
    const right = (a: number[], b: number[], c: number[]) => {
      // console.log(a, b, c)
      var nbours = getNbours(a, b, c)
      // console.log(nbours)
      for (let nb of nbours) {
        if (det(a, b, nb) < 0) return nb
      }
      throw Error("unassigned")
    }
    const left = (a: number[], b: number[], c: number[]) => {
      // console.log(a, b, c)
      var nbours = getNbours(a, b, c)
      // console.log(nbours)
      for (let nb of nbours) {
        if (det(a, b, nb) > 0) return nb
      }
      throw Error("unassigned")
    }
    const nextStep = next(curr, prev)
    // return left(prev, curr, nextStep)
    return right(prev, curr, nextStep)
  }
  const fill = (map: string[][], start: number[]) => {
    const Q = [start]
    const vis = [start.toString()]
    while (Q.length > 0) {
      const v = Q.shift()
      if (v === undefined) throw Error("empty queue")
      setVal(map, v, filler)
      for (let mv of moves) {
        const u = move(v, mv)
        if (
          validPos(map, u) &&
          val(map, u) === "." &&
          !vis.includes(u.toString())
        ) {
          vis.push(u.toString())
          Q.push(u)
        }
      }
    }
  }

  // const goByBarrierDFS = (v: number[], prev: number[], prevInner: number[]) => {
  const goByBarrierDFS = () => {
    while (S.length > 0) {
      const top = S.pop()
      if (top === undefined) throw Error("empty stack")
      const { v, prev } = top
      var inner = getInner(prev, v)
      const stepIn = inner
      // console.log(v)
      // console.log("prev", prev, "z", v, "do srodka", stepIn)
      // console.log("rozpoczynam fill")
      if (validPos(toFill, stepIn) && val(toFill, stepIn) === ".") {
        fill(toFill, stepIn)
      }
      // console.log("skonczony fill")

      vis.push(v.toString())
      // console.log("connections", v, getConnections(originalMap, v))
      for (let mv of getConnections(originalMap, v)) {
        const u = move(v, mv)
        if (!vis.includes(u.toString())) {
          // goByBarrierDFS(u, v, inner)
          S.push({ v: u, prev: v })
        }
      }
    }
  }
  var prev = move(start, [1, 0])
  let inner = [prev[0], prev[1] + 1]
  if (validPos(toFill, inner) && val(toFill, inner) === ".") {
    fill(toFill, inner)
  }
  const S: { v: number[]; prev: number[] }[] = []
  const vis: string[] = [prev.toString()]
  // var prevInner = [1,0];
  // switch (getConnections(originalMap, prev).map(v => v.toString()).filter(v => v !== [-1, 0].toString())[0]) {
  //   case [0,-1].toString(): prevInner = []
  // }
  S.push({ v: start, prev: prev })
  goByBarrierDFS()
}
const replaceS = (orginalMap: string[][], map: string[][]) => {
  const sides = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]
  for (let i = 0; i < orginalMap.length; i++) {
    const nbours = [] as number[][]
    for (let j = 0; j < orginalMap[0].length; j++) {
      if (orginalMap[i][j] === "S") {
        for (let side of sides) {
          const u = move([i, j], side)
          if (validPos(orginalMap, u) && connectedByPipe(map, [i, j], u)) {
            nbours.push(side)
          }
        }
        for (let k of Object.keys(connections)) {
          if (k === "S") continue
          if (connections[k].sort().toString() === nbours.sort().toString()) {
            setVal(orginalMap, [i, j], k)
            return
          }
        }
      }
    }
  }
}
const part2 = (rawInput: string) => {
  var map = parseInput(rawInput)
  map = addGuard(map)
  const originalMap = []
  for (var i = 0; i < map.length; i++) originalMap[i] = map[i].slice()
  const badFiller = "O"
  const goodFiller = "G"
  const SPos = getPos(map, "S")
  const movesOrder = BFS(map, SPos)
  const endloopPos = getPos(movesOrder, max(movesOrder))

  BFS2(map, endloopPos)
  console.log("bfs done")
  // displayMap(originalMap)
  replaceS(originalMap, map)
  // displayMap(originalMap)
  // displayMap(map, false)
  fillBad(map, badFiller)
  // displayMap(map, false)
  map = map.map((line) =>
    line.map((v) => (v === badFiller || isValBarrier(v) ? v : ".")),
  )
  console.log("fill bad done")

  const n = map.length
  const m = map[0].length

  var found = false
  for (let i = 1; i < n; i++) {
    if (!found)
      for (let j = 1; j < m; j++) {
        if (isBarrier(map, [i, j])) {
          console.log("staring go by barrier")
          goByBarrier(originalMap, map, [i, j], goodFiller)
          found = true
          break
        }
      }
  }
  console.log("done by barrier")

  // displayMap(map, true)
  // displayMap(map)
  // map.forEach((line, i) =>
  //   line.forEach((v, j) => {
  //     if (v === badFiller && hasBarriersNbours(map, [i, j])) {
  //       // console.log(i, j)
  //       fillBadIn(map, [i, j], badFiller, badFiller)
  //     }
  //   }),
  // )
  // displayMap(map, true)

  // displayMap(map)
  var res = 0
  map.forEach((line) =>
    line.forEach((v) => {
      if (v === goodFiller) res++
    }),
  )
  return res
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
