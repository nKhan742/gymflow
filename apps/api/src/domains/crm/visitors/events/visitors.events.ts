export class VisitorsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class VisitorsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class VisitorsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
