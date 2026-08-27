export class ServiceHistoryCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ServiceHistoryUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ServiceHistoryDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
