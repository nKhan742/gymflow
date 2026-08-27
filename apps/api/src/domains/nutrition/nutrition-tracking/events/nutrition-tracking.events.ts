export class NutritionTrackingCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class NutritionTrackingUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class NutritionTrackingDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
