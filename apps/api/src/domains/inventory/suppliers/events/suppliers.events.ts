export class SuppliersCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SuppliersUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SuppliersDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
