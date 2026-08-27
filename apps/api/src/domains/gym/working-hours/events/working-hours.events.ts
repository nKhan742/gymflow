export class WorkingHoursCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkingHoursUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkingHoursDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
