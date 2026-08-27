export class CalendarCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CalendarUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CalendarDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
