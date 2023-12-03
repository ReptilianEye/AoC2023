import { charPosition, getDirectionsCoordinates } from "./functions.js"

export const isSymbol = (char: string) => char !== "." && !char.match(/[0-9]/)
export const checkSides = (
  rowNumber: number,
  columnNumber: number,
  directions: number[][],
  map: string[],
) =>
  directions.some((dir) => {
    let [newX, newY] = [rowNumber + dir[0], columnNumber + dir[1]]
    return isSymbol(map[newX][newY])
  })

export const checkIfHasSymbolNbour = (
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
