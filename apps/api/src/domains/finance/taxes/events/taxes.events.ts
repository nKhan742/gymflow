export class TaxesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TaxesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TaxesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
