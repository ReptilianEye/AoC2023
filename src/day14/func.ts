export const move = (start: number[], moveCoord: number[]) => [
  start[0] + moveCoord[0],
  start[1] + moveCoord[1],
]
export const stepBack = (start: number[], moveCoord: number[]) => [
  start[0] - moveCoord[0],
  start[1] - moveCoord[1],
]
export const validPos = (map: any[][], pos: number[]) => {
  const n = map.length
  const m = map[0].length
  if (pos[0] < 0 || pos[0] >= n) return false
  if (pos[1] < 0 || pos[1] >= m) return false
  return true
}
export const calcResult = (map: string[][]) => {
  const n = map.length
  return map.reduce(
    (acc, line, row) =>
      acc +
      line.reduce((lineAcc, v) => (v === "O" ? lineAcc + n - row : lineAcc), 0),
    0,
  )
}
