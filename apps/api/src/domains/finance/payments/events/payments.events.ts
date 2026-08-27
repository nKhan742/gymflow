export class PaymentsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PaymentsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PaymentsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
