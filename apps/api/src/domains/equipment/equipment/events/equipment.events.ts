export class EquipmentCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class EquipmentUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class EquipmentDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
