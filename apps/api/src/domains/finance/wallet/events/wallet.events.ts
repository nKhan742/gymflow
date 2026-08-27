export class WalletCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WalletUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WalletDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
