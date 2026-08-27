export class BookingsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BookingsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BookingsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
