export class TasksCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TasksUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TasksDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
