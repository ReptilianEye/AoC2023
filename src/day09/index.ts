import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" ").map((val) => parseInt(val)))
const lastEl = (arr: any[][], i: number) => arr[i][arr[i].length - 1]
const pairOutIndex = (l: number, p: number) => (l < p ? l : p)
const buildTree = (tree: number[][], i = 0) => {
  tree.push([] as number[])
  var allZero = true
  for (let j = 0; j < tree[i].length - 1; j++) {
    tree[i + 1].push(tree[i][j + 1] - tree[i][j])
    if (tree[i + 1][pairOutIndex(j, j + 1)] != 0) allZero = false
  }
  if (!allZero) buildTree(tree, i + 1)
}
const evalSolPart1 = (tree: number[][], i = tree.length - 1): number => {
  if (i == 0) return lastEl(tree, i)
  tree[i - 1].push(lastEl(tree, i - 1) + lastEl(tree, i))
  return evalSolPart1(tree, i - 1)
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((sol, line) => {
    const tree = [line]
    buildTree(tree)
    tree[tree.length - 1].push(0)
    return sol + evalSolPart1(tree)
  }, 0)
}
const firstEl = (arr: any[][], i: number) => arr[i][0]
const evalSolPart2 = (tree: number[][], i = tree.length - 1): number => {
  if (i == 0) return firstEl(tree, i)
  tree[i - 1].unshift(firstEl(tree, i - 1) - firstEl(tree, i))
  return evalSolPart2(tree, i - 1)
}
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((sol, line) => {
    const tree = [line]
    buildTree(tree)
    tree[tree.length - 1].push(0)
    return sol + evalSolPart2(tree)
  }, 0)
  return
}

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
