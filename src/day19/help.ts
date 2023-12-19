export interface Part {
  x: number
  m: number
  a: number
  s: number
}

export interface Rule {
  condition: (part: Part) => boolean
  action: () => string
  details?: Details
}
export interface Details {
  key: keyof Part
  operator: string
  value: number
}

export class Workflow {
  rules: Rule[]
  constructor(rules: Rule[]) {
    this.rules = rules
  }
  run(part: Part) {
    for (const rule of this.rules) {
      if (rule.condition(part)) {
        return rule.action()
      }
    }
    throw new Error("No rule found")
  }
}
export const parseRule = (rawRule: string) => {
  const [conditionRaw, actionRaw] = rawRule.split(":")
  if (actionRaw === undefined)
    return <Rule>{
      condition: (part: Part) => true,
      action: () => conditionRaw,
    }
  const compareKey = conditionRaw[0]
  const compareValue = parseInt(conditionRaw.substring(2))
  const condition = (part: Part) => {
    if (conditionRaw[1] === ">")
      return part[compareKey as keyof Part] > compareValue
    return part[compareKey as keyof Part] < compareValue
  }
  return <Rule>{
    condition,
    action: () => actionRaw,
    details: {
      key: compareKey,
      operator: conditionRaw[1],
      value: compareValue,
    },
  }
}
export const parseWorkflow = (rawWorkflow: string) => {
  rawWorkflow = rawWorkflow.substring(0, rawWorkflow.length - 1)
  const [id, rest] = rawWorkflow.split("{")
  const rules = rest.split(",")
  const parsedRules = rules.map(parseRule)
  return { id, workflow: new Workflow(parsedRules) }
}
export const parsePart = (rawPart: string) => {
  rawPart = rawPart.substring(1, rawPart.length - 1)
  rawPart = rawPart.replace(/[xmas=]/g, "")
  const [x, m, a, s] = rawPart.split(",")
  return <Part>{
    x: parseInt(x),
    m: parseInt(m),
    a: parseInt(a),
    s: parseInt(s),
  }
}
