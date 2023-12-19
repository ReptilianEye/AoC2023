import { Rule } from "./help.js"

type PartId = "x" | "m" | "a" | "s"
export class PartRanges {
  ranges: Map<PartId, number[]>
  constructor(x: number[], m: number[], a: number[], s: number[]) {
    this.ranges = new Map([
      ["x", x],
      ["m", m],
      ["a", a],
      ["s", s],
    ])
  }
  get = (id: PartId) => this.ranges.get(id) as number[]
  set = (id: PartId, range: number[]) => this.ranges.set(id, range)
  keys = () => ["x", "m", "a", "s"] as PartId[]
  printRanges = () => {
    console.log(
      Array.from(
        Array.from(this.ranges.keys()).map((key) => {
          return [key, this.get(key)]
        }),
      ),
    )
  }

  getRanges = () => Array.from(this.ranges.values())
  getCombinations = () =>
    this.getRanges().reduce((acc, range) => acc * (range[1] - range[0] + 1), 1)
  checkRanges = () => {
    for (const key of this.keys()) {
      const [min, max] = this.get(key)
      if (min > max) return false
    }
    return true
  }
  intersection = (otherRanges: PartRanges) => {
    const newRanges = new PartRanges([], [], [], [])
    for (const key of this.keys()) {
      const [min1, max1] = this.get(key)
      const [min2, max2] = otherRanges.get(key)
      newRanges.set(key, [Math.max(min1, min2), Math.min(max1, max2)])
    }
    if (!newRanges.checkRanges()) return undefined
    return newRanges
  }
  fixRanges = (rule: Rule, opposite = false) => {
    const base = new PartRanges(
      [...this.get("x")],
      [...this.get("m")],
      [...this.get("a")],
      [...this.get("s")],
    )
    if (rule.details === undefined) return base
    const { key, operator, value } = rule.details
    if (!opposite) {
      if (operator === ">") {
        base.set(key, [Math.max(base.get(key)[0], value + 1), base.get(key)[1]])
      } else {
        base.set(key, [base.get(key)[0], Math.min(base.get(key)[1], value - 1)])
      }
    } else {
      if (operator === ">") {
        base.set(key, [base.get(key)[0], Math.min(base.get(key)[1], value)])
      } else {
        base.set(key, [Math.max(base.get(key)[0], value), base.get(key)[1]])
      }
    }
    return base
  }
}
