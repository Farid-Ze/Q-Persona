/**
 * Database Configuration for BaaS Integration
 * This file provides the configuration for connecting to PostgreSQL
 * through Backend as a Service (BaaS) providers like Supabase, Neon, or PlanetScale
 */

export const dbConfig = {
  // Database connection settings
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'q_persona',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  
  // SSL settings for cloud databases
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  
  // Connection pool settings
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
};

/**
 * Example BaaS providers configuration:
 * 
 * Supabase:
 * - DB_HOST: db.{project-ref}.supabase.co
 * - DB_PORT: 5432
 * - DB_SSL: true
 * 
 * Neon:
 * - DB_HOST: {endpoint-id}.{region}.aws.neon.tech
 * - DB_PORT: 5432
 * - DB_SSL: true
 * 
 * PlanetScale (MySQL):
 * - Requires different configuration
 */

export default dbConfig;
