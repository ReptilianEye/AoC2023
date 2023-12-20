import { Point } from "./Point"

export enum PairType {
  START,
  CONNECT,
  END,
}
export class Pair {
  pair: Point[]
  type: PairType
  row: number
  col1: number
  col2: number

  constructor(first: Point, second: Point) {
    this.pair = [first, second]
    ;[this.col1, this.col2] = [first.coord[1], second.coord[1]].sort()
    this.row = first.coord[0]
    if (
      this.pair.every((point) =>
        point.nbours.some((nb) => nb.coord[0] > point.coord[0]),
      )
    )
      this.type = PairType.START
    else if (
      this.pair.every((node) =>
        node.nbours.some((nb) => nb.coord[0] < node.coord[0]),
      )
    )
      this.type = PairType.END
    else this.type = PairType.CONNECT
  }

  getConnectedToHigher() {
    var res
    for (let node of this.pair) {
      console.log(node.nbours.map((nb) => nb.coord))
      if (node.nbours.some((nb) => nb.coord[0] < node.coord[0])) res = node
    }
    if (res == undefined) throw new Error("No node connected to higher")
    return res
  }
  getConnectedToLower() {
    var res
    for (let node of this.pair) {
      if (node.nbours.some((nb) => nb.coord[0] > node.coord[0])) res = node
    }
    if (res == undefined) throw new Error("No node connected to lower")
    return res
  }
}
