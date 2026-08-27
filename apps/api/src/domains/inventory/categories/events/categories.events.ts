export class CategoriesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CategoriesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CategoriesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
