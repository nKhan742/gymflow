export class SalaryCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SalaryUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SalaryDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
