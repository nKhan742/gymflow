export class AttendanceReportsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AttendanceReportsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AttendanceReportsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
