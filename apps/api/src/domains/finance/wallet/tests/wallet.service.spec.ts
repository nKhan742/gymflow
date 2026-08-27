import { WalletService } from '../service/wallet.service.js';

describe('WalletService', () => {
  it('should be defined', () => {
    const service = new WalletService();
    expect(service).toBeDefined();
  });
});
