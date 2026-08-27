export class AttendanceCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AttendanceUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AttendanceDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
