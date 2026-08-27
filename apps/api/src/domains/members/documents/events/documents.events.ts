export class DocumentsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DocumentsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DocumentsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
