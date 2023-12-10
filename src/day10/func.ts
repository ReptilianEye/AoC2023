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
  "7": [
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
