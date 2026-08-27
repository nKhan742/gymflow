export class ProductsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ProductsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ProductsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
