import run from "aocrunner"

interface Graph {
  [source: string]: { left: string; right: string }
}
const parseInput = (rawInput: string) => {
  const [instructions, _, ...map] = rawInput.split("\n")
  const Graph = map
    .map((line) => line.match(/[A-Z|1-9]{3}/g))
    .reduce(
      (G, [source, left, right]) =>
        <Graph>{
          ...G,
          [source]: { left: left, right: right },
        },
      {} as Graph,
    )
  return { instructions, Graph }
}

const part1 = (rawInput: string) => {
  const { instructions, Graph } = parseInput(rawInput)
  var steps = 0
  var i = 0
  var current: string = "AAA"
  while (current !== "ZZZ") {
    current =
      instructions[i] === "L" ? Graph[current].left : Graph[current].right
    i = (i + 1) % instructions.length
    steps++
  }
  return steps
}

const gcd = (a: number, b: number) => {
  for (let temp = b; b !== 0; ) {
    b = a % b
    a = temp
    temp = b
  }
  return a
}

const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

const part2 = (rawInput: string) => {
  const { instructions, Graph } = parseInput(rawInput)
  var currents = Object.keys(Graph).reduce(
    (acc, node) => (node.endsWith("A") ? [...acc, node] : acc),
    [] as string[],
  )
  return currents.reduce((sol, curr) => {
    var i = 0
    var steps = 0
    while (!curr.endsWith("Z")) {
      curr = instructions[i] === "L" ? Graph[curr].left : Graph[curr].right
      i = (i + 1) % instructions.length
      steps++
    }
    return lcm(sol, steps)
  }, 1)
}

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
