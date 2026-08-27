export class MealLibraryCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MealLibraryUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MealLibraryDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
