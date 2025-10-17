import { ethers } from 'ethers';
import config from '../config';

// USDC ABI (minimal - just what we need)
const USDC_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private usdcContract: ethers.Contract;

  constructor() {
    // Initialize provider
    const rpcUrl = config.blockchain.alchemy_api_key
      ? `https://base-mainnet.g.alchemy.com/v2/${config.blockchain.alchemy_api_key}`
      : config.blockchain.base_rpc_url;

    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize USDC contract
    this.usdcContract = new ethers.Contract(
      config.blockchain.usdc_contract_address,
      USDC_ABI,
      this.provider
    );
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Get USDC balance for an address
   */
  async getUSDCBalance(address: string): Promise<string> {
    try {
      if (!this.isValidAddress(address)) {
        throw new Error('Invalid address');
      }

      const balance = await this.usdcContract.balanceOf(address);
      const decimals = await this.usdcContract.decimals();

      // Convert from wei to human-readable format
      const formattedBalance = ethers.formatUnits(balance, decimals);

      return formattedBalance;
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      return '0';
    }
  }

  /**
   * Verify signature
   */
  verifySignature(message: string, signature: string, expectedAddress: string): boolean {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Get transaction details from blockchain
   */
  async getTransaction(txHash: string): Promise<any> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) {
        return null;
      }

      const receipt = await this.provider.getTransactionReceipt(txHash);

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value || 0),
        blockNumber: tx.blockNumber,
        status: receipt?.status === 1 ? 'success' : 'failed',
        timestamp: tx.blockNumber ? await this.getBlockTimestamp(tx.blockNumber) : null,
      };
    } catch (error) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }

  /**
   * Verify if transaction exists and is successful
   */
  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt !== null && receipt.status === 1;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }

  /**
   * Get block timestamp
   */
  private async getBlockTimestamp(blockNumber: number): Promise<number | null> {
    try {
      const block = await this.provider.getBlock(blockNumber);
      return block ? block.timestamp : null;
    } catch (error) {
      console.error('Error getting block timestamp:', error);
      return null;
    }
  }

  /**
   * Parse USDC transfer from transaction
   */
  async parseUSDCTransfer(txHash: string): Promise<{
    from: string;
    to: string;
    amount: string;
  } | null> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return null;
      }

      // Find Transfer event in logs
      const transferTopic = ethers.id('Transfer(address,address,uint256)');
      const transferLog = receipt.logs.find(
        log => log.topics[0] === transferTopic && 
               log.address.toLowerCase() === config.blockchain.usdc_contract_address.toLowerCase()
      );

      if (!transferLog) {
        return null;
      }

      // Decode transfer event
      const iface = new ethers.Interface(USDC_ABI);
      const decoded = iface.parseLog({
        topics: transferLog.topics as string[],
        data: transferLog.data
      });

      if (!decoded) {
        return null;
      }

      const decimals = await this.usdcContract.decimals();

      return {
        from: decoded.args[0],
        to: decoded.args[1],
        amount: ethers.formatUnits(decoded.args[2], decimals),
      };
    } catch (error) {
      console.error('Error parsing USDC transfer:', error);
      return null;
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      return ethers.formatUnits(feeData.gasPrice || 0, 'gwei');
    } catch (error) {
      console.error('Error getting gas price:', error);
      return '0';
    }
  }

  /**
   * Check if provider is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.provider.getBlockNumber();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new BlockchainService();