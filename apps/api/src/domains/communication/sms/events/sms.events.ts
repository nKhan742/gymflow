export class SmsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SmsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SmsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
