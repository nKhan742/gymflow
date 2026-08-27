export class WhatsappCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WhatsappUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WhatsappDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
