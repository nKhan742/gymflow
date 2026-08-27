export class NotificationsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class NotificationsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class NotificationsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
