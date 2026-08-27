export class ExpensesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ExpensesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ExpensesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
