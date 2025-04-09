const bcrypt = require('bcrypt');
const { hashPassword } = require('../../src/utils/password');

// Mock de bcrypt pour isoler les tests
jest.mock('bcrypt');

describe('Password Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should hash a password correctly', async () => {
    // 1. Configuration du mock
    const mockHashedPassword = '$2b$10$fakehashedpassword';
    bcrypt.hash.mockResolvedValue(mockHashedPassword);

    // 2. Exécution
    const result = await hashPassword('password123');

    // 3. Vérifications
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(result).toBe(mockHashedPassword);
  });

  it('should reject when bcrypt fails', async () => {
    // 1. Simulation d'une erreur
    bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

    // 2. Exécution + Vérification de l'erreur
    await expect(hashPassword('password123')).rejects.toThrow('Hashing failed');
  });
});