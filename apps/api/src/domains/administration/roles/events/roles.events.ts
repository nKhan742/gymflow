export class RolesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class RolesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class RolesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
