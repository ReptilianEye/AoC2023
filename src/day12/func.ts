export interface Line {
  springs: string
  counts: number[]
}
export const multiplyLine = ({ springs, counts }: Line) => {
  var springsArr = []
  var countsArr = []
  for (let i = 0; i < 5; i++) {
    springsArr.push(springs)
    countsArr.push(...counts)
  }
  return { springs: springsArr.join("?"), counts: countsArr }
}

export const canPlace = (
  springs: string,
  start: number,
  howManyToFill: number,
) => {
  var i = start
  while (i > start - howManyToFill) {
    if (i < 0) return false
    if (springs[i] === ".") return false
    i--
  }
  if (i > 0 && springs[i] === "#") return false
  return true
}
