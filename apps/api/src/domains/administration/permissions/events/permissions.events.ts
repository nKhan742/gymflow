export class PermissionsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PermissionsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PermissionsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
