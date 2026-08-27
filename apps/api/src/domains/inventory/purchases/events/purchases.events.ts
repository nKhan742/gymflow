export class PurchasesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PurchasesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PurchasesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
