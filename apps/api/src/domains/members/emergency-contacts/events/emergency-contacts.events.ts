export class EmergencyContactsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class EmergencyContactsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class EmergencyContactsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
