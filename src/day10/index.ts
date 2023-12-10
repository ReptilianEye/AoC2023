import run from "aocrunner"
import { connections, makeArray } from "./func.js"
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
const val = (map: any[][], pos: number[]) => map[pos[0]][pos[1]]
const setVal = (map: any[][], pos: number[], x: any) =>
  (map[pos[0]][pos[1]] = x)
const isBarrier = (map: string[][], pos: number[]) =>
  !isNaN(parseInt(val(map, pos)))
const areConnected = (map: string[][], pos1: number[], pos2: number[]) => {
  if (
    Object.values(keys).includes(val(map, pos1)) ||
    Object.values(keys).includes(val(map, pos2))
  )
    return false
  const diff = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1]]
  return (
    getConnections(map, pos1).some(
      (mv) => mv.toString() === diff(pos2, pos1).toString(),
    ) &&
    getConnections(map, pos2).some(
      (mv) => mv.toString() === diff(pos1, pos2).toString(),
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
  rawInput.split("\n").map((line) => line.split(""))

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
  var Q: { v: number[]; prev: string }[] = [{ v: s, prev: "0" }]
  while (Q.length > 0) {
    const next = Q.shift()
    if (next === undefined) throw Error("empty queue")
    const { v, prev: dir } = next

    for (let mv of getConnections(map, v)) {
      const u = move(v, mv)
      if (s.toString() !== u.toString() && areConnected(map, v, u)) {
        Q.push({ v: u, prev: (parseInt(dir) + 1).toString() })
      }
    }
    setVal(map, v, dir)
  }
  setVal(map, s, 0)
}
const BFS2Old = (map: string[][], s: number[]) => {
  const starting = connections[val(map, s) as string]
  var Q: { v: number[]; dir: string }[] = [
    { v: move(s, starting[0]), dir: keys.universal },
    { v: move(s, starting[1]), dir: keys.universal },
  ]
  while (Q.length > 0) {
    const next = Q.shift()
    if (next === undefined) throw Error("empty queue")
    const { v, dir } = next
    for (let mv of connections[val(map, v) as string]) {
      const u = move(v, mv)
      if (s.toString() !== u.toString() && areConnected(map, v, u)) {
        Q.push({ v: u, dir: dir })
      }
    }
    setVal(map, v, dir)
  }
  setVal(map, s, keys.left)
}
const addGuard = (map: string[][]) => {
  const withGuards = map.map((line) => ["O", ...line, "O"])
  const m = withGuards[0].length
  withGuards.unshift(Array(m).fill("O"))
  withGuards.push(Array(m).fill("O"))
  return withGuards
}
const validPos = (map: any[][], pos: number[]) => {
  const n = map.length
  const m = map[0].length
  if (pos[0] < 0 || pos[0] >= n) return false
  if (pos[1] < 0 || pos[1] >= m) return false
  return true
}

const fillBad = (map: string[][], s: number[], filler = "O") => {
  const getNbours = (map: string[][], pos: number[]) => {
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map((mv) => {
        const u = move(pos, mv)
        if (!validPos(map, u)) return []
        if (val(map, u) === filler) return []
        if (isBarrier(map, u)) return []
        return u
      })
      .filter((x) => x.length > 0)
  }
  const Q = [s]
  while (Q.length > 0) {
    const v = Q.shift()
    if (v === undefined) throw Error("empty queue")
    setVal(map, v, filler)
    for (let u of getNbours(map, v)) {
      Q.push(u)
    }
  }
}
const fillGood = (map: string[][], s: number[], filler = "G") => {
  const getNbours = (map: string[][], pos: number[]) => {
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map((mv) => {
        const u = move(pos, mv)
        if (!validPos(map, u)) return []
        if (val(map, u) === filler) return []
        if (isBarrier(map, u)) return []
        return u
      })
      .filter((x) => x.length > 0)
  }
  const Q = [s]
  while (Q.length > 0) {
    const v = Q.shift()
    if (v === undefined) throw Error("empty queue")
    setVal(map, v, filler)
    for (let u of getNbours(map, v)) {
      Q.push(u)
    }
  }
}
const displayMap = (map: string[][], ignore = false) => {
  var disp
  if (ignore) {
    disp = map.map((line, i) =>
      line.map((val, j) => (isBarrier(map, [i, j]) ? "B" : val)).join(),
    )
  } else {
    disp = map.map((line) => {
      var newL = ""
      line.forEach((val) => {
        newL = newL + ", " + (val.length == 1 ? val + " " : val)
      })
      return newL
    })
  }
  console.log(disp)
}
const hasOddBarriers = (map: string[][], pos: number[]) => {
  const steps = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  return steps.some((step) => {
    var barriers = 0
    var curr = pos
    const checkSides = (start: number[]) => {
      if (pos.toString() === "5,8") console.log(pos)
      if (pos.toString() === "5,8") console.log(start)
      const coordinate = step[0] === 0 ? 0 : 1
      if (pos.toString() === "5,8") console.log(coordinate)
      var up, down
      if (coordinate == 0) {
        up = [start[0] + 1, start[1]]
        down = [start[0] - 1, start[1]]
      } else {
        up = [start[0], start[1] + 1]
        down = [start[0], start[1] - 1]
      }
      // const up = [...start]
      // up[coordinate] = up[coordinate] + 1
      // const down = [...start]
      // down[coordinate] = down[coordinate] - 1

      if (pos.toString() === "5,8") console.log(up, down)
      console.log("---")
      if (
        validPos(map, up) &&
        Math.abs(parseInt(val(map, up)) - parseInt(val(map, prev))) == 1
      )
        return true
      if (
        validPos(map, down) &&
        Math.abs(parseInt(val(map, down)) - parseInt(val(map, prev))) == 1
      )
        return true
      return false
    }
    while (validPos(map, curr)) {
      if (isBarrier(map, curr)) {
        var prev = curr
        var next = move(prev, step)
        while (
          validPos(map, next) &&
          isBarrier(map, next) &&
          Math.abs(parseInt(val(map, next)) - parseInt(val(map, prev))) == 1
        ) {
          prev = next
          next = move(prev, step)
        }
        if (prev.toString() === curr.toString() || checkSides(prev)) {
          // console.log("inc", curr)
          barriers++
        }
        curr = prev
      }
      curr = move(curr, step)
    }
    // if (barriers % 2 == 1) console.log(pos)
    // else console.log("--")
    return barriers % 2 == 1
  })
}
const part2 = (rawInput: string) => {
  var map = parseInput(rawInput)
  map = addGuard(map)
  const badFiller = "O"
  const goodFiller = "G"
  const SPos = getPos(map, "S")
  const movesOrder = BFS(map, SPos)
  const endloopPos = getPos(movesOrder, max(movesOrder))
  BFS2(map, endloopPos)
  displayMap(map, true)
  map.forEach((line, i) =>
    line.forEach((v, j) => {
      if (v === "O") fillBad(map, [i, j], badFiller)
    }),
  )
  displayMap(map, false)
  map.forEach((line, i) =>
    line.forEach((v, j) => {
      if (
        v !== badFiller &&
        v !== goodFiller &&
        !isBarrier(map, [i, j]) &&
        hasOddBarriers(map, [i, j])
      ) {
        // console.log(i, j)
        fillGood(map, [i, j], goodFiller)
      }
    }),
  )
  displayMap(map, true)

  // displayMap(map)
  // var res = 0
  // map.forEach((line) =>
  //   line.forEach((v) => {
  //     if (v === goodFiller) res++
  //   }),
  // )
  // return res
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
      //       {
      //         input: `...........
      //       .S-------7.
      //       .|F-----7|.
      //       .||.....||.
      //       .||.....||.
      //       .|L-7.F-J|.
      //       .|..|.|..|.
      //       .L--J.L--J.
      //       ...........`,
      //         expected: 4,
      //       },
      //       {
      //         input: `..........
      // .S------7.
      // .|F----7|.
      // .||....||.
      // .||....||.
      // .|L-7F-J|.
      // .|..||..|.
      // .L--JL--J.
      // ..........`,
      //         expected: 4,
      //       },
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
      // {
      //   input: `FF7FSF7F7F7F7F7F---7
      // L|LJ||||||||||||F--J
      // FL-7LJLJ||||||LJL-77
      // F--JF--7||LJLJ7F7FJ-
      // L---JF-JLJ.||-FJLJJ7
      // |F|F-JF---7F7-L7L|7|
      // |FFJF7L7F-JF7|JL---7
      // 7-L-JL7||F7|L7F-7F7|
      // L.L7LFJ|||||FJL7||LJ
      // L7JLJL-JLJLJL--JLJ.L`,
      //   expected: 8,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
