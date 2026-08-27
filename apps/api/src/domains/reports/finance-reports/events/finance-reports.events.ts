export class FinanceReportsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FinanceReportsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FinanceReportsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
