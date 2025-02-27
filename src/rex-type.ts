export abstract class RexType<Type = any, RexValidation = any> {
  protected _validations: RexValidation[] = []
  protected _addValidate(check: RexValidation) {
    this._validations.push(check)
    return this
  }

  abstract parse(input: unknown): Type
}
