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
  const start = "10"
  var Q: { v: number[]; prev: string }[] = [{ v: s, prev: start }]
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
  setVal(map, s, start)
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

const fillBad = (map: string[][], s: number[], filler = "O") => {
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
const fillBadIn = (
  map: string[][],
  s: number[],
  badFiller: string,
  filler = "G",
) => {
  const visited: string[] = []
  const gavePass: { [key: string]: number[] } = {}
  const getNbours = (map: string[][], pos: number[]) => {
    const movesBarrier: number[][] = []
    if (isBarrier(map, pos)) {
      const pass = gavePass[pos.toString()]
      // console.log("pass", pass, opposite(pass))
      moves.forEach((mv) => {
        const u = move(pos, mv)
        if (
          mv.toString() !== opposite(pass).toString() &&
          validPos(map, u) &&
          val(map, u) === "."
        )
          movesBarrier.push(u)
      })
    }
    return [
      ...movesBarrier,
      ...moves
        .map((mv) => {
          const u = move(pos, mv)
          if (!validPos(map, u)) return []
          if (val(map, u) === filler) return []
          if (val(map, u) === badFiller) return []

          if (isBarrier(map, u)) {
            if (isBarrier(map, pos)) {
              if (!connectedByPipe(map, pos, u)) {
                return []
              }
              gavePass[u.toString()] = move(gavePass[pos.toString()], mv)
              return u
            }
            var nbours = []
            if (mv[0] != 0) {
              nbours = [move(u, [0, 1]), move(u, [0, -1])]
            } else {
              nbours = [move(u, [1, 0]), move(u, [-1, 0])]
            }
            if (pos.toString() === "7,5") console.log("nbours", nbours)
            var pass = null
            if (
              nbours.some((nb) => {
                if (
                  validPos(map, nb) &&
                  (val(map, nb) === "." || isBarrier(map, nb)) &&
                  !connectedByPipe(map, u, nb)
                ) {
                  pass = substract(nb, u)
                  return true
                }
                return false
              })
            ) {
              if (pass) gavePass[u.toString()] = pass
              return u
            } else return []
          }
          if (!connectedByPipe(map, u, pos)) return []

          if (pos.toString() === "7,5") console.log("rest", u)
          return u
        })
        .filter((x) => x.length > 0)
        .filter((mv) => !visited.includes(mv.toString())),
    ]
    // .map((mv) => (typeof mv[0] === "number" ? [...mv, null] : mv))
  }
  const Q = [s]
  while (Q.length > 0) {
    const v = Q.shift()
    if (v === undefined) throw Error("empty queue")
    if (val(map, v) === ".") {
      console.log("maluje", v)
      setVal(map, v, filler)
    }
    console.log(v, "moves", getNbours(map, v))
    for (let u of getNbours(map, v)) {
      visited.push(u.toString())
      Q.push(u)
    }
  }
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
  map.map((line, i) =>
    line.map((val, j) => val === badFiller || isValBarrier(val)) ? val : ".",
  )
  displayMap(map, true)
  displayMap(map)
  map.forEach((line, i) =>
    line.forEach((v, j) => {
      if (v === badFiller && hasBarriersNbours(map, [i, j])) {
        // console.log(i, j)
        fillBadIn(map, [i, j], badFiller, badFiller)
      }
    }),
  )
  displayMap(map, true)

  displayMap(map)
  var res = 0
  map.forEach((line) =>
    line.forEach((v) => {
      if (v === ".") res++
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
      // {
      //         input: `...........
      // .S-------7.
      // .|F-----7|.
      // .||.....||.
      // .||.....||.
      // .|L-7.F-J|.
      // .|..|.|..|.
      // .L--J.L--J.
      // ...........`,
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
