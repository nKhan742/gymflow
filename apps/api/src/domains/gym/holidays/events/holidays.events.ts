export class HolidaysCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class HolidaysUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class HolidaysDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
