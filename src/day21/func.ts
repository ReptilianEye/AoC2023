import { move, moves, validPos } from "../help_func.js"

export const bfsLimitSteps = (
  map: string[][],
  start: [number, number],
  limit: number,
) => {
  const Q = [] as [number, number][][]
  const visited = new Set<string>()
  Q.push([start])
  let round = 0
  while (round < limit) {
    visited.clear()
    const roundBatch = [] as [number, number][]
    const nextQ = Q.shift()!
    for (const pos of nextQ) {
      for (let mv of moves) {
        const newPos = move(pos, mv) as [number, number]
        if (
          validPos(map, newPos) &&
          map[newPos[0]][newPos[1]] === "." &&
          !visited.has(newPos.toString())
        ) {
          visited.add(newPos.toString())
          roundBatch.push(newPos)
        }
      }
    }
    Q.push(roundBatch)
    round++
  }
  return visited.size
}
export const printMap = (map: string[][], walkedOn: [number, number][]) => {
  const mapCopy = map.map((line) => [...line])
  walkedOn.forEach(([x, y]) => {
    mapCopy[y][x] = "O"
  })
  console.log(mapCopy.map((line) => line.join("")).join("\n"))
}
