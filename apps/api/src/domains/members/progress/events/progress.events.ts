export class ProgressCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ProgressUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ProgressDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
