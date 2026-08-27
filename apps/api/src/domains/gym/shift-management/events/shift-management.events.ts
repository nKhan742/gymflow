export class ShiftManagementCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ShiftManagementUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ShiftManagementDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
