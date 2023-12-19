import run from "aocrunner"
import { PartRanges } from "./PartRanges.js"
import { Part, Workflow, parsePart, parseWorkflow } from "./help.js"

const parseInput = (rawInput: string) => {
  const [workflows, parts] = rawInput.split("\n\n")
  const workflowsMap = new Map<string, Workflow>()
  workflows.split("\n").forEach((rawWorkflow) => {
    const { id, workflow } = parseWorkflow(rawWorkflow)
    workflowsMap.set(id, workflow)
  })
  const parsedParts = parts.split("\n").map(parsePart)
  return { workflows: workflowsMap, parts: parsedParts }
}
const sumPart = (part: Part) => part.x + part.m + part.a + part.s

const handlePart = (part: Part, workflows: Map<string, Workflow>) => {
  var workflow = "in"
  while (workflow !== "R" && workflow !== "A") {
    workflow = (workflows.get(workflow) as Workflow).run(part)
  }
  if (workflow === "A") return sumPart(part)
  return 0
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { workflows, parts } = input
  return parts.reduce((acc, part) => acc + handlePart(part, workflows), 0)
}

const dfs = (workflows: Map<string, Workflow>) => {
  const dfs_rec = (workflow: string, current: PartRanges) => {
    if (!current.checkRanges()) return
    if (workflow === "R") return
    if (workflow === "A") {
      solutions.push(current)
      return
    }
    const currentWorkflow = workflows.get(workflow) as Workflow
    const rules = currentWorkflow.rules
    for (let rule of rules) {
      const newRanges = current.fixRanges(rule)
      dfs_rec(rule.action(), newRanges)
      current = current.fixRanges(rule, true)
    }
  }
  const solutions = [] as PartRanges[]
  dfs_rec("in", new PartRanges([1, 4000], [1, 4000], [1, 4000], [1, 4000]))
  return solutions.reduce(
    (acc, solution) => acc + solution.getCombinations(),
    0,
  )
}
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { workflows } = input
  return dfs(workflows)
}

run({
  part1: {
    tests: [
      {
        input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
