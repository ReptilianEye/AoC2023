import { Point } from "./Point"

export class BarrierPoint {
  coord: number[]
  innerSide: "left" | "right"
  constructor(coord: number[], innerSide: "left" | "right") {
    this.coord = coord
    this.innerSide = innerSide
  }
  updateRow(newRow: number) {
    this.coord[0] = newRow
  }
  updateCol(newCol: number) {
    this.coord[1] = newCol
  }
}
const comparePoints = (a: BarrierPoint, b: BarrierPoint) =>
  a.coord[1] - b.coord[1]
export class SortedArray {
  arr = [] as BarrierPoint[]
  compare = comparePoints
  add(el: BarrierPoint) {
    var i = 0
    while (i < this.arr.length && this.compare(this.arr[i], el) < 0) i++
    this.arr.splice(i, 0, el)
  }
  get(i: number) {
    return this.arr[i]
  }
  find(x: number) {
    var i = 0
    while (i < this.arr.length && this.arr[i].coord[1] !== x) i++
    return i
  }
  remove(x: number) {
    var i = this.find(x)
    this.arr.splice(i, 1)
  }
  replace(point: BarrierPoint, coord: number[]) {
    // console.log("old", point.coord, "new", coord)
    // this.arr[this.find(point.coord[1])] = new BarrierPoint(
    //   [...coord],
    //   point.innerSide,
    // )
    point.coord = [...coord]
    // this.arr.sort(comparePoints)
  }

  // getLeftFrom(x: number) {
  //   return this.arr[this.find(x) - 1]
  // }
  // getRightFrom(x: number) {
  //   return this.arr[this.find(x) + 1]
  // }
}
