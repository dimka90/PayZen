import fs from 'fs';
import path from 'path';
import db from './index';

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');

    // Read the full SQL file (don’t split by ;)
    const migrationPath = path.join(__dirname, '../../src/database/migrations.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Run the entire SQL script at once
    await db.query(migrationSQL);

    console.log('✅ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
