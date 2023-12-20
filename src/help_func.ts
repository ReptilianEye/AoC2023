export const validPos = (map: any[][], pos: number[]) => {
  const n = map.length
  const m = map[0].length
  if (pos[0] < 0 || pos[0] >= n) return false
  if (pos[1] < 0 || pos[1] >= m) return false
  return true
}
export const substract = (a: number[], b: number[]) => [
  a[0] - b[0],
  a[1] - b[1],
]
export const move = (start: number[], moveCoord: number[]) => [
  start[0] + moveCoord[0],
  start[1] + moveCoord[1],
]
export const distanceABS = (a: number[], b: number[]) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
