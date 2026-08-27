export class EmailCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class EmailUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class EmailDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
