import Redis fron 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // Create the Redis client
    this.client = redis.createClient();

    // Log errors to the console
    this.client.on('error', (err) => {
      console.error(`Redis Client Error: ${err.message}`);
    });

    // Promisify the get, set, and del methods for async/await usage
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Check if Redis client connection is alive
   * @returns {boolean}
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get a value from Redis by key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string | null>}
   */
  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (error) {
      console.error(`Error retrieving key "${key}": ${error.message}`);
      return null;
    }
  }

  /**
   * Set a value in Redis with an expiration
   * @param {string} key - The key to set
   * @param {string} value - The value to set
   * @param {number} duration - The duration in seconds for the key to expire
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    try {
      await this.setAsync(key, value, 'EX', duration);
    } catch (error) {
      console.error(`Error setting key "${key}" with value "${value}": ${error.message}`);
    }
  }

  /**
   * Delete a key from Redis
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (error) {
      console.error(`Error deleting key "${key}": ${error.message}`);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
