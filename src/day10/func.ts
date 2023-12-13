const connections: {
  [key: string]: number[][]
} = {
  S: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  ".": [],
  O: [],

  "|": [
    [-1, 0],
    [1, 0],
  ],
  "-": [
    [0, -1],
    [0, 1],
  ],
  L: [
    [-1, 0],
    [0, 1],
  ],
  J: [
    [-1, 0],
    [0, -1],
  ],
  T: [
    [1, 0],
    [0, -1],
  ],
  F: [
    [1, 0],
    [0, 1],
  ],
}
const getConnections = (map: string[][], v: number[]) => {
  if (val(map, v) in connections) return connections[val(map, v) as string]
  return []
}
const makeArray = (n: number, m: number, val: any) => {
  var arr = [] as any[]
  for (let i = 0; i < n; i++) {
    arr[i] = [] as any[]
    for (let j = 0; j < m; j++) {
      arr[i][j] = val
    }
  }
  return arr
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
const moves = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]
const validPos = (map: any[][], pos: number[]) => {
  const n = map.length
  const m = map[0].length
  if (pos[0] < 0 || pos[0] >= n) return false
  if (pos[1] < 0 || pos[1] >= m) return false
  return true
}
const isBarrier = (map: string[][], pos: number[]) =>
  validPos(map, pos) && !isNaN(parseInt(val(map, pos)))

//   const isValBarrier = (x: string) => !isNaN(parseInt(x))
const val = (map: any[][], pos: number[]) => map[pos[0]][pos[1]]
const setVal = (map: any[][], pos: number[], x: any) =>
  (map[pos[0]][pos[1]] = x)

export const replaceRestWithDot = (
  toFix: string[][],
  checkOn: string[][],
  badFiller: string,
) =>
  toFix.map((line, i) =>
    line.map((v, j) => {
      const pos = [i, j]
      if (val(checkOn, pos) === badFiller) return badFiller
      if (isBarrier(checkOn, pos)) return v
      return "."
    }),
  )
export const getPos = (input: any[][], x: any) => {
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
const move = (start: number[], moveCoord: number[]) => [
  start[0] + moveCoord[0],
  start[1] + moveCoord[1],
]
const substract = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1]]

const areConnected = (map: string[][], pos1: number[], pos2: number[]) => {
  return (
    getConnections(map, pos1).some(
      (mv) => mv.toString() === substract(pos2, pos1).toString(),
    ) &&
    getConnections(map, pos2).some(
      (mv) => mv.toString() === substract(pos1, pos2).toString(),
    )
  )
}

export const max = (arr: number[][]) =>
  arr.reduce(
    (maxV, line) =>
      Math.max(
        maxV,
        line.reduce((maxInLine, el) => Math.max(el, maxInLine), -1),
      ),
    -1,
  )

export const BFSFindBarrier = (map: string[][], s: number[]) => {
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
export const BFSMarkBarrier = (map: string[][], s: number[]) => {
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
export const replaceS = (orginalMap: string[][], map: string[][]) => {
  const sides = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]
  const connectedByPipe = (map: string[][], pos1: number[], pos2: number[]) => {
    return Math.abs(parseInt(val(map, pos1)) - parseInt(val(map, pos2))) == 1
  }
  const replace = (x: number, y: number) => {
    const nbours = [] as number[][]
    for (let side of sides) {
      const u = move([x, y], side)
      if (validPos(orginalMap, u) && connectedByPipe(map, [x, y], u)) {
        nbours.push(side)
      }
    }
    for (let k of Object.keys(connections)) {
      if (k === "S") continue
      if (connections[k].sort().toString() === nbours.sort().toString()) {
        setVal(orginalMap, [x, y], k)
        return
      }
    }
  }
  for (let i = 0; i < orginalMap.length; i++) {
    for (let j = 0; j < orginalMap[0].length; j++) {
      if (orginalMap[i][j] === "S") {
        replace(i, j)
        return
      }
    }
  }
}

export const addGuard = (map: string[][]) => {
  const withGuards = map.map((line) => ["O", ...line, "O"])
  const m = withGuards[0].length
  withGuards.unshift(Array(m).fill("O"))
  withGuards.push(Array(m).fill("O"))
  return withGuards
}

export const fillBad = (map: string[][], filler = "O") => {
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
export const cutBarriersOddTimes = (
  originalMap: string[][],
  start: number[],
) => {
  const countBarriersSpecific = (direction: number, horizonally: boolean) => {
    const sameSide = (pipe1: string, pipe2: string) => {
      const conn1 = connections[pipe1].filter((v) => v[1 - mainCoordinate] != 0)
      const conn2 = connections[pipe2].filter((v) => v[1 - mainCoordinate] != 0)
      return conn1.toString() === conn2.toString()
    }
    const mainCoordinate = horizonally ? 1 : 0
    var ignore, easy
    if (horizonally) {
      ignore = "-"
      easy = "|"
    } else {
      ignore = "|"
      easy = "-"
    }
    var cutted = 0
    const step = horizonally ? [0, direction] : [direction, 0]
    const S: string[] = []
    var [i, j] = start
    for (; validPos(originalMap, [i, j]); [i, j] = move([i, j], step)) {
      const v = originalMap[i][j]
      if (v === easy) {
        cutted++
        continue
      }
      if (v === "O" || v === "." || v === ignore) continue
      const top = S.pop()
      if (top == undefined) S.push(v)
      else {
        if (sameSide(top, v)) {
          S.push(top)
          S.push(v)
        } else cutted++
      }
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
