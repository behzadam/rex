export abstract class RexType<Type = any, RexCheck = any> {
  protected _checks: RexCheck[] = []
  protected _check(check: RexCheck) {
    this._checks.push(check)
    return this
  }

  abstract parse(input: unknown): Type
}
