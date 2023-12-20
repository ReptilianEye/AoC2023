import run from "aocrunner"
import { Module } from "module"
import { Stream } from "stream"

type ModuleType = "broadcaster" | "%" | "&" | "test"

interface Module {
  id: string
  type: ModuleType
  connected: string[]
}

enum Signal {
  high = "high",
  low = "low",
}
const parseModule = (rawModule: string): Module => {
  const [idRaw, connectedRaw] = rawModule.split(" -> ")
  var type: ModuleType, id
  if (idRaw.includes("broadcaster")) {
    type = "broadcaster"
    id = "broadcaster"
  } else if (idRaw.includes("%")) {
    type = "%"
    id = idRaw.replace("%", "")
  } else if (idRaw.includes("&")) {
    type = "&"
    id = idRaw.replace("&", "")
  } else {
    type = "test"
    id = idRaw
  }
  const connected = connectedRaw.split(", ")
  return { id, type, connected }
}
const parseInput = (rawInput: string) => {
  const System = new Map()
  const input = rawInput.split("\n")
  const flipFlopsState = new Map<string, boolean>()
  const conjectionState = new Map<string, Map<string, Signal>>()
  const parsedModules = input.map(parseModule)
  parsedModules.forEach((module) => {
    module.connected.forEach((nb) => {
      System.set(nb, { id: nb, type: "test", connected: [] })
    })
  })
  parsedModules.forEach((module) => {
    System.set(module.id, module)
    if (module.type === "%") {
      flipFlopsState.set(module.id, false)
    }
    if (module.type === "&") {
      conjectionState.set(module.id, new Map())
    }
  })
  parsedModules.forEach((module) => {
    module.connected.forEach((nb) => {
      const nbModule = System.get(nb)
      if (nbModule.type === "&") {
        conjectionState.get(nbModule.id)!.set(module.id, Signal.low)
      }
    })
  })
  return { System, flipFlopsState, conjectionState }
}
interface QueueElement {
  id: string
  parent: string
  signal: Signal
}

const simulateOneClick = (
  System: Map<string, Module>,
  flipFlopsState: Map<string, boolean>,
  conjectionState: Map<string, Map<string, Signal>>,
  observed?: string,
  cycleLenght?: { [id: string]: Set<number> },
  nOfClicks?: number,
) => {
  const Q: QueueElement[] = [
    { id: "broadcaster", parent: "button", signal: Signal.low },
  ]
  var lowSignals = 0
  var highSignals = 0
  var printed = false
  while (Q.length > 0) {
    const top = Q.shift()
    if (top === undefined) throw new Error("top is undefined")
    const { id, parent, signal } = top
    if (id === observed) {
      // break
      // return conjectionState.get(observed)
      // if (
      //   Array.from(conjectionState.get(observed)!.values()).some(
      //     (v) => v === Signal.high,
      //   )
      // ) {
      if (cycleLenght === undefined || nOfClicks === undefined)
        throw new Error("cycleLenght or nOfClicks is undefined")
      Array.from(conjectionState.get(observed)?.entries()!).forEach(
        ([id, signal]) => {
          if (cycleLenght[id].size < 2 && signal === Signal.high) {
            cycleLenght[id].add(nOfClicks)
          }
        },
      )

      // if (!printed) console.log("--------")
      // printed = true
      // console.log(Array.from(conjectionState.get(observed)!.values()))
      // }
    }
    // if (["dd", "fh", "xp", "fc", observed].includes(id)) console.log(id)
    if (signal === Signal.low)
      // console.log(parent, "-", signal, "->", id)
      lowSignals++
    else highSignals++

    const module = System.get(id)!
    if (id === "broadcaster") {
      for (let nb of module.connected) {
        Q.push({ id: nb, parent: id, signal: Signal.low })
      }
    } else if (module.type === "%") {
      if (signal === Signal.low) {
        const turnedOnBefore = flipFlopsState.get(id)
        const signalToSend = turnedOnBefore ? Signal.low : Signal.high
        flipFlopsState.set(id, !turnedOnBefore)
        for (let nb of module.connected) {
          Q.push({ id: nb, parent: id, signal: signalToSend })
        }
      }
    } else if (module.type === "&") {
      const conjection = conjectionState.get(id)!
      conjection.set(parent, signal)
      var signalToSend = Signal.high
      if (Array.from(conjection.values()).every((v) => v === Signal.high))
        signalToSend = Signal.low
      for (let nb of module.connected) {
        Q.push({ id: nb, parent: id, signal: signalToSend })
      }
    }
  }
  if (observed === undefined)
    return { lowSignals, highSignals, prev: undefined }
  return { lowSignals, highSignals, prev: conjectionState.get(observed) }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { System, flipFlopsState, conjectionState } = input
  var lowSignals = 0
  var highSignals = 0
  for (let i = 0; i < 1000; i++) {
    const result = simulateOneClick(System, flipFlopsState, conjectionState)
    if (typeof result !== "boolean") {
      const { lowSignals: lowGot, highSignals: highGot } = result
      lowSignals += lowGot
      highSignals += highGot
    }
  }
  console.log("lowSignals", lowSignals)
  console.log("highSignals", highSignals)
  return lowSignals * highSignals
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { System, flipFlopsState, conjectionState } = input
  var clicks = 0
  const observeCycleOf = ["dd", "fh", "xp", "fc"]
  const cycleLenght: { [id: string]: Set<number> } = {
    dd: new Set<number>(),
    fh: new Set<number>(),
    xp: new Set<number>(),
    fc: new Set<number>(),
  }
  while (true) {
    const { prev } = simulateOneClick(
      System,
      flipFlopsState,
      conjectionState,
      "dn",
      cycleLenght,
      clicks,
    )
    // return
    // console.log(prev)
    // console.log(flipFlopsState)
    // if (prev === undefined) throw new Error("prev is undefined")
    // for (let observed of observeCycleOf) {
    //   if (
    //     cycleLenght[observed as keyof typeof cycleLenght] == -1 &&
    //     prev!.get(observed) === Signal.high
    //   ) {
    //     cycleLenght[observed as keyof typeof cycleLenght] = sol
    //     // console.log(observed, Array.from(conjection.values()))
    //     // if (
    //     //   cycleLenght[observed as keyof typeof cycleLenght] == -1 &&
    //     //   Array.from(conjection.values()).every((v) => v === Signal.high)
    //     // ) {
    //   }
    // }
    // console.log(Object.values(cycleLenght))
    if (Object.values(cycleLenght).every((v) => v.size === 2)) {
      return Object.values(cycleLenght)
        .map((it) => Array.from(it))
        .map((v) => Math.abs(v[0] - v[1]))
        .reduce(lcmFunction)
    }
    // // if (typeof result === "boolean") {
    // //   console.log(result)
    // //   if (result) return sol
    // }
    // console.log(sol)
    clicks++
  }
}

function gcd(a: number, b: number) {
  for (let temp = b; b !== 0; ) {
    b = a % b
    a = temp
    temp = b
  }
  return a
}

function lcmFunction(a: number, b: number) {
  const gcdValue = gcd(a, b)
  return (a * b) / gcdValue
}

run({
  part1: {
    tests: [
      {
        input: `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`,
        expected: 32000000,
      },
      {
        input: `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`,
        expected: 11687500,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
