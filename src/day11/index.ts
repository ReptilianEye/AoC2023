import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""))

export const displayMap = (map: string[][]) => {
  var disp = map.map((line) => line.join())
  console.log(disp)
}
interface Position {
  i: number
  j: number
}
const addRow = (universe: string[][], row: number) => {
  universe.splice(row, 0, Array(universe[0].length).fill("."))
}
const addColumn = (universe: string[][], column: number) => {
  universe.map((line) => line.splice(column, 0, "."))
}
const fillRow = (universe: string[][], row: number, filler: string) => {
  universe.splice(row, 1, Array(universe[0].length).fill(filler))
}
const fillColumn = (universe: string[][], column: number, filler: string) => {
  universe.map((line) => line.splice(column, 1, filler))
}

const expandUniverse = (universe: string[][], filler?: string) => {
  for (let i = 0; i < universe.length; i++) {
    var noGalaxies = true
    for (let j = 0; j < universe[0].length; j++) {
      if (universe[i][j] === "#") noGalaxies = false
    }
    if (noGalaxies) {
      if (filler) {
        fillRow(universe, i, filler)
      } else {
        addRow(universe, i)
        i++
      }
    }
  }
  for (let j = 0; j < universe[0].length; j++) {
    var noGalaxies = true
    for (let i = 0; i < universe.length; i++) {
      if (universe[i][j] === "#") noGalaxies = false
    }
    if (noGalaxies) {
      if (filler) {
        fillColumn(universe, j, filler)
      } else {
        addColumn(universe, j)
        j++
      }
    }
  }
}
const markGalaxies = (universe: string[][]) => {
  var galaxies = 0
  const galaxiesPos: { [galaxyNo: number]: Position } = {}
  universe.forEach((line, i) =>
    line.forEach((v, j) => {
      if (v === "#") {
        universe[i][j] = galaxies.toString()
        galaxiesPos[galaxies] = { i: i, j: j }
        galaxies++
      }
    }),
  )
  return galaxiesPos
}
const distance = (p1: Position, p2: Position) =>
  Math.abs(p1.i - p2.i) + Math.abs(p1.j - p2.j)

const part1 = (rawInput: string) => {
  const universe = parseInput(rawInput)
  displayMap(universe)
  expandUniverse(universe)
  displayMap(universe)
  const galaxiesPos = markGalaxies(universe)
  const galaxiesCount = Object.keys(galaxiesPos).length
  var totalDistance = 0
  for (let g1 = 0; g1 < galaxiesCount; g1++) {
    for (let g2 = g1 + 1; g2 < galaxiesCount; g2++) {
      totalDistance += distance(galaxiesPos[g1], galaxiesPos[g2])
    }
  }
  return totalDistance
}
const distanceUltraSpace = (
  universe: string[][],
  p1: Position,
  p2: Position,
  spaceFiller = "|",
) => {
  const rowStep = p2.i - p1.i > 0 ? 1 : -1
  const columnStep = p2.j - p1.j > 0 ? 1 : -1
  var spacesPassed = 0
  for (let i = p1.i; i != p2.i; i = i + rowStep) {
    if (universe[i][p1.j] === spaceFiller) spacesPassed++
  }
  for (let i = p1.j; i != p2.j; i = i + columnStep)
    if (universe[p2.i][i] === spaceFiller) spacesPassed++
  return distance(p1, p2) - spacesPassed + 1000000 * spacesPassed
}
const part2 = (rawInput: string) => {
  const universe = parseInput(rawInput)
  const spaceFiller = "|"
  expandUniverse(universe, spaceFiller)
  const galaxiesPos = markGalaxies(universe)
  const galaxiesCount = Object.keys(galaxiesPos).length
  var totalDistance = 0
  for (let g1 = 0; g1 < galaxiesCount; g1++) {
    for (let g2 = g1 + 1; g2 < galaxiesCount; g2++) {
      totalDistance += distanceUltraSpace(
        universe,
        galaxiesPos[g1],
        galaxiesPos[g2],
        spaceFiller,
      )
    }
  }
  return totalDistance
}

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 8410,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
