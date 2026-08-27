export class GroupClassesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class GroupClassesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class GroupClassesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
