import run from "aocrunner"
import { moves, printMap, validPos } from "../help_func.js"

const slopes = new Map<string, [number, number][]>([
  [">", [[0, 1]]],
  ["<", [[0, -1]]],
  ["^", [[-1, 0]]],
  ["v", [[1, 0]]],
  [".", moves],
  ["#", []],
])
const dfs = (
  map: string[][],
  start: [number, number],
  end: [number, number],
) => {
  const S = [{ pos: [1, 1], vis: new Set<string>([`${start[0]},${start[1]}`]) }]
  var sol = -1
  while (S.length) {
    const { pos, vis } = S.pop()!
    const [x, y] = pos
    if (x === end[0] && y === end[1]) {
      sol = Math.max(sol, vis.size)
      continue
    }
    vis.add(`${x},${y}`)
    for (let [dx, dy] of slopes.get(map[x][y])!) {
      if (map[x + dx][y + dy] === "#") continue
      if (vis.has(`${x + dx},${y + dy}`)) continue
      S.push({ pos: [x + dx, y + dy], vis: new Set(vis) })
    }
  }
  return sol
}
const findStartAndEnd = (map: string[][]) => {
  let start: [number, number] = [0, 1]

  for (let i = 0; i < map[0].length; i++)
    if (map[0][i] === ".") {
      start = [0, i]
      break
    }

  let end: [number, number] = [map.length - 1, map.length - 2]
  for (let i = map[map.length - 1].length - 1; i >= 0; i--)
    if (map[map.length - 1][i] === ".") {
      end = [map.length - 1, i]
      break
    }
  return { start, end }
}
const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { start, end } = findStartAndEnd(input)
  const sol = dfs(input, start, end)
  return sol
}

const findNodes = (
  map: string[][],
  start: [number, number],
  end: [number, number],
) => {
  const nodes = [start, end]
  const vis = new Set<string>([
    `${start[0]},${start[1]}`,
    `${end[0]},${end[1]}`,
  ])
  const S = [[1, 1]]
  while (S.length) {
    const [x, y] = S.shift()!
    if (x === end[0] && y === end[1]) continue
    const nbours = moves.filter(
      ([dx, dy]) =>
        validPos(map, [x + dx, y + dy]) && map[x + dx][y + dy] !== "#",
    )
    if (nbours.length > 2) nodes.push([x, y])
    for (let [dx, dy] of nbours) {
      if (vis.has(`${x + dx},${y + dy}`)) continue
      vis.add(`${x + dx},${y + dy}`)
      S.push([x + dx, y + dy])
    }
  }
  return nodes
}
interface Node {
  nbour: string
  wage: number
}
const toGraph = (map: string[][], nodes: [number, number][]) => {
  const G = new Map<string, Node[]>()
  const mappedNodes = new Map<string, string>(
    nodes.map(([x, y], i) => [
      `${x},${y}`,
      i == 0 ? "S" : i == 1 ? "E" : i.toString(),
    ]),
  )
  nodes.forEach(([x, y]) => {
    const nbours = getNbours(map, [x, y], mappedNodes)
    G.set(mappedNodes.get(`${x},${y}`)!, nbours)
  })
  return { G, mappedNodes }
}
const getNbours = (
  map: string[][],
  start: [number, number],
  mappedNodes: Map<string, string>,
) => {
  const nbours = [] as Node[]
  const Q = [{ pos: start, steps: 0 }]
  const vis = new Set<string>([`${start[0]},${start[1]}`])
  while (Q.length) {
    const {
      pos: [x, y],
      steps,
    } = Q.shift()!
    if (mappedNodes.has(`${x},${y}`) && steps !== 0) {
      nbours.push({ nbour: mappedNodes.get(`${x},${y}`)!, wage: steps })
      continue
    }
    for (let [dx, dy] of moves) {
      const newPos = [x + dx, y + dy] as [number, number]
      if (!validPos(map, newPos)) continue
      if (map[newPos[0]][newPos[1]] === "#") continue
      if (vis.has(`${newPos[0]},${newPos[1]}`)) continue
      vis.add(`${newPos[0]},${newPos[1]}`)
      Q.push({ pos: newPos, steps: steps + 1 })
    }
  }
  return nbours
}
const findLongestPathReq = (
  G: Map<string, Node[]>,
  v: string,
  end: string,
  vis: Set<string> = new Set<string>([v]),
) => {
  let sol = -1
  if (v === end) return 0
  vis.add(v)
  for (let { nbour, wage } of G.get(v)!) {
    if (vis.has(nbour)) continue
    sol = Math.max(
      sol,
      findLongestPathReq(G, nbour, end, new Set(vis).add(nbour)) + wage,
    )
  }

  return sol
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map((line) =>
    line.map((c) => (c === "#" ? "#" : ".")),
  )
  const { start, end } = findStartAndEnd(input)
  const { G, mappedNodes } = toGraph(input, findNodes(input, start, end))
  return findLongestPathReq(G, "S", "E")
}

run({
  part1: {
    tests: [
      {
        input: `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
        expected: 94,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
        expected: 154,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
