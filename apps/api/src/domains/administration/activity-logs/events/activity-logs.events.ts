export class ActivityLogsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ActivityLogsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ActivityLogsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
