import dotenv from 'dotenv';

dotenv.config();

interface Config {
  node_env: string;
  port: number;
  api_version: string;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
     expires_in: string | number;
  };
  blockchain: {
    base_rpc_url: string;
    chain_id: number;
    usdc_contract_address: string;
    alchemy_api_key?: string;
  };
  cors: {
    origins: string[];
  };
  security: {
    rate_limit_window: number;
    rate_limit_max: number;
  };
}

const config: Config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  api_version: process.env.API_VERSION || 'v1',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'payzen_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  blockchain: {
    base_rpc_url: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    chain_id: parseInt(process.env.BASE_CHAIN_ID || '8453', 10),
    usdc_contract_address: process.env.USDC_CONTRACT_ADDRESS || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    alchemy_api_key: process.env.ALCHEMY_API_KEY,
  },
  
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  
  security: {
    rate_limit_window: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rate_limit_max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export default config;