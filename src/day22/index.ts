import run from "aocrunner"

interface Point {
  x: number
  y: number
}

interface Brick {
  surface: [Point, Point]
  height: number
  id: number
}

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) =>
      line
        .split("~")
        .map((coords) => coords.split(",").map((v) => parseInt(v))),
    )
    .map(
      ([p1, p2], i) =>
        <Brick>{
          surface: [
            { x: p1[0], y: p1[1] },
            { x: p2[0], y: p2[1] },
          ],
          height: Math.abs(p2[2] - p1[2]) + 1,
          id: i,
        },
    )

const doOverlap = (brick1: Brick, brick2: Brick) => {
  const l1 = brick1.surface[0] // bottom left
  const r1 = brick1.surface[1] // upper right
  const l2 = brick2.surface[0] // bottom left
  const r2 = brick2.surface[1] // upper right
  // console.log(brick1, brick2)
  if (l1.x > r2.x || l2.x > r1.x) {
    return false
  }
  // console.log(l2.y, r1.y)
  // console.log("x overlap", l2.y > r1.y)
  if (l1.y > r2.y || l2.y > r1.y) {
    return false
  }

  return true
}
class BrickStack {
  state = new Map<number, Brick[]>([[0, []]])
  childs = new Map<Brick, Set<number>>()
  addBrick(brick: Brick) {
    this.childs.set(brick, new Set())
    for (let level of Array.from(this.state.keys()).sort((a, b) => b - a)) {
      // console.log(level)
      for (let brickOnLvl of this.state.get(level) || []) {
        // console.log(
        //   brickOnLvl,
        //   "compare with",
        //   brick,
        //   "overlaps",
        //   doOverlap(brick, brickOnLvl),
        // )
        const overlapsWith = (this.state.get(level) || []).filter((b) =>
          doOverlap(brick, b),
        )
        const highest = Math.max(...overlapsWith.map((b) => b.height))
        // if (doOverlap(brick, brickOnLvl)) {
        if (overlapsWith.length > 0) {
          // console.log("standing on me:", this.childs.get(brickOnLvl))
          this.addToFundaments(brick, overlapsWith, highest)
          this.placeBrick(brick, level + highest)
          return
        }
      }
    }
    // console.log("no overlap")
    this.state.get(0)?.push(brick)
  }
  private addToFundaments(
    brick: Brick,
    overlapsWith: Brick[],
    highest: number,
  ) {
    overlapsWith
      .filter((b) => b.height == highest)
      .forEach((b) => {
        this.childs.get(brick)?.add(b.id)
      })
  }
  private placeBrick(brick: Brick, landLevel: number) {
    // let landLevel = level + brickOnLvl.height
    // console.log("land level", landLevel)
    if (this.state.has(landLevel))
      (this.state.get(landLevel) as Brick[]).push(brick)
    else this.state.set(landLevel, [brick])
  }
  getOnLevel(level: number) {
    return this.state.get(level)
  }
  howManyCanDelete() {
    const blackList = new Set<number>()
    this.childs.forEach((v) => {
      if (v.size == 1) blackList.add(v.values().next().value)
    })
    return this.childs.size - blackList.size
  }
}
const solvePart1 = (bricks: Brick[]) => {
  const stack = new BrickStack()
  // var i = 0
  for (let brick of bricks) {
    stack.addBrick(brick)
    // console.log(stack.state)
    // stack.childs.forEach((v, k) => console.log(k, v))
    // i++
    // if (i == 7) return
    // console.log("-----")
  }
  return stack.howManyCanDelete()
  // stack.childs.forEach((v, k) =>
  //   console.log(
  //     k,
  //     "lezy na:",
  //     v.map((v) => v[0].surface),
  //     // .forEach((v) => console.log(v[0])),
  //     // "----",
  //   ),
  // )
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return solvePart1(input)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        input: `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
        expected: 5,
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
