import { resolve } from 'path';
import { config } from 'dotenv';
import {
  describe,
  expect,
  test,
  jest,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from '@jest/globals';

// Load environment variables for testing
config({ path: resolve(__dirname, '../.env.test') });

// Add any global setup needed for integration tests
global.beforeAll = async () => {
  // Setup database connections, test fixtures, etc.
};

global.afterAll = async () => {
  // Cleanup resources after tests
};
