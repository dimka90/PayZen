import app from './app';
import config from './config';
import db from './database';

const PORT = config.port;

// Test database connection before starting server
async function startServer() {
  try {
    // Test database connection
    const isDbHealthy = await db.healthCheck();
    
    if (!isDbHealthy) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }

    console.log('✅ Database connection established');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 PayZen API Server running on port ${PORT}`);
      console.log(`📍 Environment: ${config.node_env}`);
      console.log(`🔗 Base URL: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/${config.api_version}/health`);
      console.log(`⛓️  Blockchain: Base Network (Chain ID: ${config.blockchain.chain_id})`);
      console.log(`💵 USDC Contract: ${config.blockchain.usdc_contract_address}`);
      console.log("RPC", config.blockchain.base_rpc_url);
      console.log("Chain Id", config.blockchain.chain_id);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️  SIGINT signal received: closing HTTP server');
  await db.close();
  process.exit(0);
});

// Start the server
startServer();