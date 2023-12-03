export const parseInput = (rawInput: string) => {
  const inTable = rawInput
    .split("\n")
    .map((line) => line.trim())
    .map((line) => "." + line + ".")
  const dotBoundary = Array.from(Array(inTable[0].length))
    .map((_) => ".")
    .join("")
  return [dotBoundary, ...inTable, dotBoundary]
}

export enum charPosition {
  LEFT,
  MIDDLE,
  RIGHT,
  SOLO,
}
export const getDirectionsCoordinates = (
  direction: charPosition,
): number[][] => {
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
      ].slice(2) //remove one base
  }
}
