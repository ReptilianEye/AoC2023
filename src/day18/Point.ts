import { SortedArray } from "./dumbSortedArray.js"

export class Point {
  coord: number[]
  nbours: Point[]
  constructor(coord: number[], nbours: Point[]) {
    this.coord = coord
    this.nbours = nbours
  }
  getHigher() {
    var res = this.nbours.find((nb) => nb.coord[1] > this.coord[1])
    if (res == undefined) throw new Error("No node higher")
    return res
  }
  getSameSide(sides: SortedArray) {
    return sides.get(sides.find(this.coord[1]))
  }
  getOtherSide(sides: SortedArray) {
    const i = sides.find(this.coord[1])
    console.log(i)
    if (i > 0 && sides.arr[i - 1].innerSide === "right") return sides.arr[i - 1]
    if (i < sides.arr.length - 1 && sides.arr[i + 1].innerSide === "left")
      return sides.arr[i + 1]

    // throw new Error("No other side")
  }
  // const x0 = sides.arr[i][0]
  // console.log(sides.arr)
  // console.log(this.nbours.some((nb) => nb.coord[1] > x0))
  // if (this.nbours.some((nb) => nb.coord[0] > x0)) return sides.arr[i - 1]
  // else return sides.arr[i + 1]
  // }
}
