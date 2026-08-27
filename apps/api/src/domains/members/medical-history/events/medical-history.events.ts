export class MedicalHistoryCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MedicalHistoryUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MedicalHistoryDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
