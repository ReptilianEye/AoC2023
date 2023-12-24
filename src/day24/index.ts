import run from "aocrunner"

interface Line {
  x1: number
  y1: number
  z1: number
  x2: number
  y2: number
  z2: number
}

const parseInput = (rawInput: string) => {
  return rawInput
    .split("\n")
    .map((l) => l.split("@").map((l) => l.split(", ").map((v) => parseInt(v))))
    .map(
      ([s, v]) =>
        <Line>{
          x1: s[0],
          y1: s[1],
          z1: s[2],
          x2: s[0] + v[0],
          y2: s[1] + v[1],
          z2: s[2] + v[2],
        },
    )
}
const mat_det = (a: [number, number], b: [number, number]) =>
  a[0] * b[1] - a[1] * b[0]

function getIntersect(seg1: Line, seg2: Line) {
  const { x1, x2, y1, y2 } = seg1
  const { x1: x3, x2: x4, y1: y3, y2: y4 } = seg2

  const den = mat_det([x1 - x2, x3 - x4], [y1 - y2, y3 - y4])
  if (den == 0) return Infinity
  const t = mat_det([x1 - x3, x3 - x4], [y1 - y3, y3 - y4]) / den
  const u = -mat_det([x1 - x2, x1 - x3], [y1 - y2, y1 - y3]) / den
  // console.log(seg1, t, seg2, u)
  if (t < 0 || u < 0) return Infinity
  return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]
}
const ifInBoundary = (
  point: [number, number],
  bottomLimit: number,
  upperLimit: number,
) => {
  const [x, y] = point
  return (
    bottomLimit <= x && x <= upperLimit && bottomLimit <= y && y <= upperLimit
  )
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  // const bottomLimit = 7
  // const upperLimit = 27
  const bottomLimit = 200000000000000
  const upperLimit = 400000000000000
  var sol = 0
  for (let i = 0; i < input.length; i++)
    for (let j = i + 1; j < input.length; j++) {
      const intersect = getIntersect(input[i], input[j])
      if (
        intersect !== Infinity &&
        ifInBoundary(intersect as [number, number], bottomLimit, upperLimit)
      ) {
        // console.log(input[i], input[j], intersect)
        sol++
      }
    }
  return sol
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        input: `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`,
        expected: 2,
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
  // onlyTests: true,
})
