export class AttendanceAnalyticsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AttendanceAnalyticsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AttendanceAnalyticsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
