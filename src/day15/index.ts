import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split(",")
const myHash = (input: string) => {
  var currHash = 0
  for (let s of input) {
    currHash += s.charCodeAt(0)
    currHash *= 17
    currHash %= 256
  }
  return currHash
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((acc, curr) => acc + myHash(curr), 0)
}

type Operation = "=" | "-"
interface Lens {
  label: string
  operation: Operation
  length: number | undefined
}
const parseLens = (rawLens: string): Lens => {
  const operation = (rawLens.includes("=") ? "=" : "-") as Operation
  const [label, length] = rawLens.split(operation)
  return {
    label,
    operation,
    length: length ? parseInt(length) : undefined,
  }
}
const calcResult = (lensMap: Map<number, Lens[]>) => {
  var sol = 0
  lensMap.forEach((val, box) => {
    sol += val.reduce(
      (acc, lens, i) => acc + (box + 1) * (i + 1) * (lens.length || 1),
      0,
    )
  })
  return sol
}
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map(parseLens)
  const lensMap = new Map<number, Lens[]>()
  input.forEach((lens) => {
    lensMap.set(myHash(lens.label), [])
  })
  input.forEach((lens) => {
    const currHash = myHash(lens.label)
    let A = lensMap.get(currHash)
    if (!A) throw Error("A is undefined")
    let idx = A.findIndex((l) => l.label === lens.label)
    if (lens.operation === "=") {
      if (idx === -1) A.push(lens)
      else A[idx] = lens
    }
    if (lens.operation === "-") {
      if (idx !== -1) A.splice(idx, 1)
    }
  })
  return calcResult(lensMap)
}

run({
  part1: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
