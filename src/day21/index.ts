import run from "aocrunner"
import { move, moves, validPos } from "../help_func.js"
import { bfsLimitSteps as bfsPart1 } from "./func.js"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""))

const teleport = (
  map: string[][],
  mapCoords: [number, number],
  pos: [number, number],
  mv: [number, number],
) => {
  var newPos = move(pos, mv) as [number, number]
  if (validPos(map, newPos)) {
    return { newPos, newMapCoords: mapCoords }
  }
  var newMapCoords = move(mapCoords, mv) as [number, number]
  newPos = [
    (newPos[0] + map.length) % map.length,
    (newPos[1] + map[0].length) % map[0].length,
  ]
  return { newPos, newMapCoords }
}
interface QueueItem {
  coords: [number, number]
  mapCoords: [number, number]
}
const bfsPart2 = (map: string[][], start: [number, number], steps: number) => {
  const Q = [] as QueueItem[][]
  const visited = new Set()
  Q.push([{ coords: start, mapCoords: [0, 0] }])
  var odds = new Set()
  var evens = new Set()
  const oddsHistory = []
  const evensHistory = []

  var step = 1
  var sol = 0
  while (step <= steps) {
    const roundBatch = [] as QueueItem[]
    const nextQ = Q.shift()!
    // console.log(nextQ)
    for (const { coords, mapCoords } of nextQ) {
      for (let mv of moves) {
        const { newPos, newMapCoords } = teleport(map, mapCoords, coords, mv)
        const QueItem = { coords: newPos, mapCoords: newMapCoords }
        // if (newPos.toString() === "10,10") {
        //   console.log(newPos, newMapCoords)
        //   console.log(map[newPos[0]][newPos[1]])
        //   console.log(!visited.has(JSON.stringify(QueItem)))
        // }
        // console.log(JSON.stringify(QueItem))
        if (
          map[newPos[0]][newPos[1]] === "." &&
          !visited.has(JSON.stringify(QueItem))
        ) {
          visited.add(JSON.stringify(QueItem))
          roundBatch.push(QueItem)
        }
      }
    }
    if (step % 2 == 0)
      evens = new Set([
        ...evens,
        ...roundBatch.map((it) => JSON.stringify(it.coords)),
      ])
    else
      odds = new Set([
        ...odds,
        ...roundBatch.map((it) => JSON.stringify(it.coords)),
      ])

    evensHistory.push(evens.size)
    oddsHistory.push(odds.size)
    Q.push(roundBatch)
    step++
  }
  return { oddsHistory, evensHistory }
}
const findS = (map: string[][]): [number, number] | undefined => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "S") {
        map[y][x] = "."
        return [x, y]
      }
    }
  }
}
const ExpandMap = (map: string[][], n: number) => {
  const SPos = findS(map)!
  const newMap = Array.from({ length: map.length * n }, () =>
    Array.from({ length: map[0].length * n }, () => "."),
  )
  for (let mapRow = 0; mapRow < n; mapRow++) {
    for (let mapCol = 0; mapCol < n; mapCol++) {
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          newMap[mapRow * map.length + row][mapCol * map[row].length + col] =
            map[row][col]
        }
      }
    }
  }
  return {
    newMap,
    SPos: [
      SPos[0] + (map.length * (n - 1)) / 2,
      SPos[1] + (map[0].length * (n - 1)) / 2,
    ],
  }
}
const bfsWithLimit = (
  map: string[][],
  start: [number, number],
  limit: number = Infinity,
) => {
  const Q = [{ v: start, it: 0 }]
  const vis = new Set([start.toString()])
  var sol = 0
  while (Q.length > 0) {
    const { v, it } = Q.shift()!
    if (it > limit) break
    const [x, y] = v
    if (it % 2 == 0) sol++
    for (let mv of moves) {
      const newPos = move([x, y], mv) as [number, number]
      if (
        validPos(map, newPos) &&
        !vis.has(newPos.toString()) &&
        map[newPos[0]][newPos[1]] === "."
      ) {
        vis.add(newPos.toString())
        Q.push({ v: newPos, it: it + 1 })
      }
    }
  }
  return sol
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return bfsWithLimit(input, findS(input)!, 64)
  return bfsPart1(input, findS(input)!, 64)
}
const bfsMark = (map: string[][], start: [number, number]) => {
  const Q = [{ v: start, it: 0 }]
  const vis = new Set()
  while (Q.length > 0) {
    const { v, it } = Q.shift()!
    const [x, y] = v
    map[x][y] = it.toString()
    for (let mv of moves) {
      const newPos = move([x, y], mv) as [number, number]
      if (
        validPos(map, newPos) &&
        !vis.has(JSON.stringify(newPos)) &&
        map[newPos[0]][newPos[1]] === "."
      ) {
        vis.add(JSON.stringify(newPos))
        Q.push({ v: newPos, it: it + 1 })
      }
    }
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { oddsHistory } = bfsPart2(input, findS(input)!, 3 * 262 + 65)
  const steps = 101150
  console.log("odds length:", oddsHistory.length, 3 * 262 + 65)
  let a = oddsHistory[2 * 262 + 65]
  let b = oddsHistory[2 * 262 + 65] - oddsHistory[262 + 65]
  let c =
    oddsHistory[3 * 262 + 65] -
    2 * oddsHistory[2 * 262 + 65] +
    oddsHistory[262 + 65]
  return a + b * (steps - 2) + c * Math.floor(((steps - 2) * (steps - 1)) / 2)
  // print(a + b*(steps-2) + c*((steps-2)*(steps-1)//2))
  // return bfsCalc(input, findS(input)!)
  // const { newMap, SPos } = ExpandMap(input, 5)
  // bfsMark(newMap, SPos as [number, number])
  // console.log(
  //   newMap
  //     .map((line) => {
  //       return line.reduce((acc, cur) => {
  //         return acc + (cur.length == 1 ? "  " : " ") + cur
  //       }, "")
  //     })
  //     .join("\n"),
  // )
  // return
  const n = input.length
  // const maps = (26501365 - Math.floor(input.length / 2)) / input.length
  const width = (26501365 - Math.floor(input.length / 2)) / input.length
  // console.log("maps", sides)
  // const sideMaps = 2 * n - 2
  // const corner_maps = maps - sideMaps
  // const cornersOverlaps = corner_maps / 4
  // console.log("corner overlapses: ", corner_maps / 4)
  const base = bfsWithLimit(input, findS(input)!)
  const sides: [number, number][] = [
    [0, Math.floor(n / 2)],
    [Math.floor(n / 2), 0],
    [n - 1, Math.floor(n / 2)],
    [Math.floor(n / 2), n - 1],
  ]
  const sideSolutions = sides.map((side) => bfsWithLimit(input, side))
  const sideSolutionsRest = sides.map((side) => bfsWithLimit(input, side, n))
  const corners: [number, number][] = [
    [0, 0],
    [0, n - 1],
    [n - 1, 0],
    [n - 1, n - 1],
  ]
  const cornerSolutions = corners.map((corner) => bfsWithLimit(input, corner))
  const cornerSolutionsRest = corners.map((corner) =>
    bfsWithLimit(input, corner, n),
  )
  return (
    base +
    sideSolutions.reduce((acc, cur) => acc + cur, 0) * (width - 1) +
    sideSolutionsRest.reduce((acc, cur) => acc + cur, 0) +
    cornerSolutions.reduce((acc, cur) => acc + cur, 0) * (2 * (width - 2) - 1) +
    cornerSolutionsRest.reduce((acc, cur) => acc + cur, 0) * (width * 2 - 1)
  )
  // console.log(input[10][10])
  // const originalInput = input.map((line) => [...line])

  // // console.log(newMap.map((line) => line.join("")).join("\n"))
  // // console.log(SPos)
  // console.log(bfsPart1(newMap, SPos as [number, number], 11))
  // console.log(bfsPart2(originalInput, findS(originalInput)!, 11))
  // return bfsPart2(input, findS(input)!, 1000)
}

run({
  part1: {
    tests: [
      {
        input: `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
        expected: 16, //dla steps=6
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
......##.#.
.###..#..#.
..#.#...#..
.##.#.#....
.....S.....
.##......#.
.......##..
.##.#.####.
.##...#.##.
...........`,
        expected: 16, //dla steps=6
      },
      //       {
      //         input: `...........
      // .....###.#.
      // .###.##..#.
      // ..#.#...#..
      // ....#.#....
      // .##..S####.
      // .##..#...#.
      // .......##..
      // .##.#.####.
      // .##..##.##.
      // ...........`,
      //         expected: 16,
      //       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
