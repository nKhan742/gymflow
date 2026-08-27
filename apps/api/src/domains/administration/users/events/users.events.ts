export class UsersCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class UsersUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class UsersDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
