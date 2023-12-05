export interface Range {
  start: number
  end: number
}
export interface Mapping {
  range: Range
  mappingValue: number
}

export const intersect = (base: Range, compar: Range) => {
  const l = Math.max(base.start, compar.start)
  const r = Math.min(base.end, compar.end)
  if (l <= r) {
    const rest = []
    if (base.start < l) {
      rest.push({ start: base.start, end: l - 1 })
    }
    if (r < base.end) {
      rest.push({ start: r + 1, end: base.end })
    }
    return { inters: <Range>{ start: l, end: r }, rest: rest }
  }
  return { inters: null, res: [] }
}

export const handleMapping = (mapping: Mapping[], ranges: Range[]) => {
  const mapped = []
  while (true) {
    const range = ranges.shift()
    if (range == undefined) break
    var usedMapping = false
    for (let mapRange of mapping) {
      let { inters, rest } = intersect(range, mapRange.range)
      if (inters) {
        mapped.push({
          start: inters.start + mapRange.mappingValue,
          end: inters.end + mapRange.mappingValue,
        })
        if (rest) ranges.push(...rest)
        usedMapping = true
        break
      }
    }
    if (!usedMapping) mapped.push(range)
  }
  return mapped
}
