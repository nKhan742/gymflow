export class DepartmentsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DepartmentsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DepartmentsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
