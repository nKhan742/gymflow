export class ChangePasswordCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ChangePasswordUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ChangePasswordDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
