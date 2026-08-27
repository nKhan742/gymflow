export class BranchesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BranchesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BranchesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
