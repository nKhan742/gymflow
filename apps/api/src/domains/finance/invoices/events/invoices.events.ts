export class InvoicesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class InvoicesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class InvoicesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
