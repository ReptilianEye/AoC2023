import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const inTable = rawInput
    .split("\n")
    .map((line) => line.trim())
    .map((line) => "." + line + ".")
  const dotBoundary = Array.from(Array(inTable[0].length))
    .map((_) => ".")
    .join("")
  return [dotBoundary, ...inTable, dotBoundary]
}
enum charPosition {
  LEFT,
  MIDDLE,
  RIGHT,
  SOLO,
}
const getDirectionsCoordinates = (direction: charPosition): number[][] => {
  const base = [
    [-1, 0],
    [1, 0],
  ]
  switch (direction) {
    case charPosition.LEFT:
      return [...base, [1, -1], [0, -1], [-1, -1]]
    case charPosition.MIDDLE:
      return base
    case charPosition.RIGHT:
      return [...base, [-1, 1], [0, 1], [1, 1]]
    case charPosition.SOLO:
      return [
        ...getDirectionsCoordinates(charPosition.LEFT),
        ...getDirectionsCoordinates(charPosition.RIGHT),
      ]
  }
}

const isSymbol = (char: string) => char !== "." && !char.match(/[0-9]/)
const checkSides = (
  rowNumber: number,
  columnNumber: number,
  directions: number[][],
  map: string[],
) =>
  directions.some((dir) => {
    let [newX, newY] = [rowNumber + dir[0], columnNumber + dir[1]]
    return isSymbol(map[newX][newY])
  })

const checkIfSymbolNbour = (
  rowNumber: number,
  startIndex: number,
  numberLength: number,
  map: string[],
) => {
  const endIndex = startIndex + numberLength - 1
  if (startIndex == endIndex)
    return checkSides(
      rowNumber,
      startIndex,
      getDirectionsCoordinates(charPosition.SOLO),
      map,
    )
  return Array(numberLength)
    .fill(0)
    .map((_, i) => i + startIndex)
    .some((column) => {
      var direction
      switch (column) {
        case startIndex:
          direction = charPosition.LEFT
          break
        case endIndex:
          direction = charPosition.RIGHT
          break
        default:
          direction = charPosition.MIDDLE
          break
      }
      return checkSides(
        rowNumber,
        column,
        getDirectionsCoordinates(direction),
        map,
      )
    })
}
const part1 = (rawInput: string) => {
  const map = parseInput(rawInput)
  return map.reduce((acc, line, row) => {
    let matches = [...line.matchAll(/[0-9]+/g)]
    return (
      acc +
      matches.reduce((lineSum, match) => {
        let [foundNumber, index] = [match[0], match.index]
        if (index == null) {
          console.log("err")
          return lineSum
        }
        return (
          lineSum +
          (checkIfSymbolNbour(row, index, foundNumber.length, map)
            ? parseInt(foundNumber)
            : 0)
        )
      }, 0)
    )
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        input: `467..114..
                ...*......
                ..35..633.
                ......#...
                617*......
                .....+.58.
                ..592.....
                ......755.
                ...$.*....
                .664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
