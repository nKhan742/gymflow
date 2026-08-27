export class LeadsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class LeadsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class LeadsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
