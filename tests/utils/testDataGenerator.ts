/**
 * Test Data Factory for generating deterministic mock and edge-case models
 */
export class TestDataGenerator {
  static generateGymTenant() {
    const timestamp = Date.now().toString().slice(-4);
    return {
      gymName: `Titan Fitness Hub ${timestamp}`,
      ownerFullName: `Alexander Vance ${timestamp}`,
      email: `admin.titan${timestamp}@gymflow.io`,
      phone: `+1 (555) 839-${timestamp}`,
      country: 'United States',
      currency: 'USD',
      branchName: `Flagship Downtown Campus ${timestamp}`,
      branchAddress: `${timestamp} Performance Blvd, Suite 100`,
      password: 'StrongPassword123!',
    };
  }

  static generateMember() {
    const id = Date.now().toString().slice(-4);
    return {
      code: `GF-${id}`,
      name: `Athlete Test ${id}`,
      email: `athlete${id}@testcorp.io`,
      phone: `+1-555-01${id}`,
      gender: 'MALE',
      planTier: 'VIP_PLATINUM',
      status: 'active',
    };
  }

  static generateInvoice(memberCode: string, memberName: string) {
    const num = Date.now().toString().slice(-5);
    return {
      invoiceNumber: `INV-2026-${num}`,
      memberCode,
      memberName,
      memberEmail: `${memberCode.toLowerCase()}@testcorp.io`,
      totalAmount: 1499.00,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PAID' as const,
      dueDate: new Date().toISOString().slice(0, 10),
    };
  }

  static generateExerciseCategory() {
    const id = Date.now().toString().slice(-4);
    return {
      code: `CAT-TEST-${id}`,
      name: `Biomechanical Pattern ${id}`,
      primaryMuscleGroup: 'CHEST',
      movementPattern: 'PUSH',
      exerciseCount: 12,
    };
  }
}

