export class StaffCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class StaffUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class StaffDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
