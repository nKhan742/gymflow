export class AppointmentsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AppointmentsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AppointmentsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
