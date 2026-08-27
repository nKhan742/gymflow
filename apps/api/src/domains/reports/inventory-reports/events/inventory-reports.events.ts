export class InventoryReportsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class InventoryReportsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class InventoryReportsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
