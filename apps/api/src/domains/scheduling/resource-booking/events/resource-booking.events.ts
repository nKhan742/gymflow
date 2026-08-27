export class ResourceBookingCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ResourceBookingUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ResourceBookingDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
