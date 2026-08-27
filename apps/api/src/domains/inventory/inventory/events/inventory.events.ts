export class InventoryCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class InventoryUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class InventoryDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
