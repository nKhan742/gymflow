export class MaintenanceCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MaintenanceUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MaintenanceDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
