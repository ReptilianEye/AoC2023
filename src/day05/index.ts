import run from "aocrunner"
import { Mapping, Range, handleMapping } from "./part2func.js"

const parseInput = (rawInput: string) => {
  const [header, ...maps] = rawInput.split("\n\n")
  const seeds = header
    .split(":")[1]
    .trim()
    .split(" ")
    .map((val) => parseInt(val))
  const mapsPipeline = maps.map((single) =>
    single
      .split(":")[1]
      .trim()
      .split("\n")
      .map((line) => line.split(" ").map((val) => parseInt(val))),
  )
  return { seeds, mapsPipeline }
}

interface myDict {
  [key: number]: number
}
const prepareMap = (keys: number[]) => {
  return keys.reduce((acc, val) => ({ ...acc, [val]: val }), {} as myDict)
}

const readMap = (mappingHint: number[][], keys: number[]) => {
  return mappingHint.reduce((acc, [startingValue, startingKey, n]) => {
    Object.keys(acc)
      .map((key) => parseInt(key))
      .forEach((key) => {
        if (startingKey <= key && key <= startingKey + n)
          acc[key] = startingValue + (key - startingKey)
      })
    return acc
  }, prepareMap(keys))
}

const part1 = (rawInput: string) => {
  const { seeds, mapsPipeline } = parseInput(rawInput)

  const final = mapsPipeline.reduce(
    (prev, currentMappingHint) =>
      readMap(currentMappingHint, Object.values(prev)),
    prepareMap(seeds),
  )
  return Object.values(final).reduce((theLowest, curr) =>
    Math.min(theLowest, curr),
  )
}

const part2 = (rawInput: string) => {
  const { seeds, mapsPipeline } = parseInput(rawInput)
  const mappingRanges = mapsPipeline.map((line) =>
    line.map(
      ([startingValue, startingKey, n]) =>
        <Mapping>{
          range: <Range>{ start: startingKey, end: startingKey + n - 1 },
          mappingValue: startingValue - startingKey,
        },
    ),
  )
  const ranges: Range[] = []
  for (let i = 0; i < seeds.length; i += 2) {
    ranges.push({
      start: seeds[i],
      end: seeds[i] + seeds[i + 1] - 1,
    })
  }
  const final = mappingRanges.reduce(
    (prevRanges, currentMapping) => handleMapping(currentMapping, prevRanges),
    ranges,
  )
  return final.reduce(
    (prevMin, { start }) => Math.min(prevMin, start),
    Infinity,
  )
}

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
