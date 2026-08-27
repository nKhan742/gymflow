import { BodyMeasurementsService } from '../service/body-measurements.service.js';

describe('BodyMeasurementsService', () => {
  it('should be defined', () => {
    const service = new BodyMeasurementsService();
    expect(service).toBeDefined();
  });
});
