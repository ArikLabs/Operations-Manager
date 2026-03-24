export class DomainRuleViolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainRuleViolation";
  }
}

export function assertDomainRule(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new DomainRuleViolation(message);
  }
}
