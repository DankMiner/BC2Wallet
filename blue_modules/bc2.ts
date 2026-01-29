import * as bitcoin from 'bitcoinjs-lib';
import { BC2_MAINNET } from './bc2-network';

// Register BC2 as a custom network
export const bc2Network: bitcoin.Network = {
  messagePrefix: BC2_MAINNET.messagePrefix,
  bech32: BC2_MAINNET.bech32,
  bip32: BC2_MAINNET.bip32,
  pubKeyHash: BC2_MAINNET.pubKeyHash,
  scriptHash: BC2_MAINNET.scriptHash,
  wif: BC2_MAINNET.wif,
};

// Export for use throughout the app
export default bc2Network;
