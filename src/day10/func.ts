export const connections: {
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
export const makeArray = (n: number, m: number, val: any) => {
  var arr = [] as any[]
  for (let i = 0; i < n; i++) {
    arr[i] = [] as any[]
    for (let j = 0; j < m; j++) {
      arr[i][j] = val
    }
  }
  return arr
}

export const displayMap = (map: string[][], ignore = false) => {
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
export const moves = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]
export const validPos = (map: any[][], pos: number[]) => {
  const n = map.length
  const m = map[0].length
  if (pos[0] < 0 || pos[0] >= n) return false
  if (pos[1] < 0 || pos[1] >= m) return false
  return true
}
export const isBarrier = (map: string[][], pos: number[]) =>
  validPos(map, pos) && !isNaN(parseInt(val(map, pos)))
export const isValBarrier = (x: string) => !isNaN(parseInt(x))
export const val = (map: any[][], pos: number[]) => map[pos[0]][pos[1]]
export const setVal = (map: any[][], pos: number[], x: any) =>
  (map[pos[0]][pos[1]] = x)

export function replaceRestWithDot(map: string[][], badFiller: string) {
  map = map.map((line) =>
    line.map((v) => (v === badFiller || isValBarrier(v) ? v : ".")),
  )
}
