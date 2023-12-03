import { charPosition, getDirectionsCoordinates } from "./functions.js"

export const starsKey = (i: number, j: number) => `${i},${j}`
export interface starsDict {
  [pos: string]: string[]
}
export const fillStars = (stars: starsDict, map: string[]) => {
  map.forEach((line, row) => {
    ;[...line].forEach((char, column) => {
      if (char === "*") stars[starsKey(row, column)] = []
    })
  })
}

const checkSidesAndAppend = (
  rowNumber: number,
  columnNumber: number,
  directions: number[][],
  numberStr: string,
  map: string[],
  stars: starsDict,
) =>
  directions.forEach((dir) => {
    let [newX, newY] = [rowNumber + dir[0], columnNumber + dir[1]]
    if (map[newX][newY] === "*") stars[starsKey(newX, newY)].push(numberStr)
  })

export const appendNearStars = (
  rowNumber: number,
  startIndex: number,
  numberStr: string,
  map: string[],
  stars: starsDict,
) => {
  const endIndex = startIndex + numberStr.length - 1
  if (startIndex == endIndex) {
    checkSidesAndAppend(
      rowNumber,
      startIndex,
      getDirectionsCoordinates(charPosition.SOLO),
      numberStr,
      map,
      stars,
    )
  } else {
    Array(numberStr.length)
      .fill(0)
      .map((_, i) => i + startIndex)
      .forEach((column) => {
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
        checkSidesAndAppend(
          rowNumber,
          column,
          getDirectionsCoordinates(direction),
          numberStr,
          map,
          stars,
        )
      })
  }
}
