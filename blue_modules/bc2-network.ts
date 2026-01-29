/**
 * BC2 (BitcoinII) Network Configuration
 * 
 * This file contains all network-specific parameters for BitcoinII.
 * Based on official BC2 chainparams from BitcoinII-Core.
 */

import { Network } from 'bitcoinjs-lib';

// =============================================================================
// BC2 MAINNET PARAMETERS
// =============================================================================

export const BC2_MAINNET: Network = {
  messagePrefix: '\x18BitcoinII Signed Message:\n',
  bech32: 'bc2',
  bip32: {
    public: 0x043587cf,   // xpub prefix
    private: 0x04358394,  // xprv prefix
  },
  pubKeyHash: 0x19,       // 25 decimal - addresses start with 'B'
  scriptHash: 0x1c,       // 28 decimal - P2SH addresses
  wif: 0xef,              // 239 decimal - WIF private key prefix
};

// =============================================================================
// BIP44 COIN TYPE
// =============================================================================

/**
 * BIP44 coin type for BC2
 * Used in HD derivation paths: m/purpose'/coin_type'/account'/change/index
 * 
 * BC2 uses coin type 2
 * - Native SegWit (P2WPKH): m/84'/2'/0'/0/0
 * - SegWit P2SH:           m/49'/2'/0'/0/0
 * - Legacy (P2PKH):        m/44'/2'/0'/0/0
 */
export const BC2_COIN_TYPE = 2;

// =============================================================================
// DERIVATION PATHS
// =============================================================================

export const BC2_DERIVATION_PATHS = {
  // BIP84 - Native SegWit (bc21q...)
  NATIVE_SEGWIT: `m/84'/${BC2_COIN_TYPE}'/0'`,
  
  // BIP49 - SegWit P2SH (3...)
  SEGWIT_P2SH: `m/49'/${BC2_COIN_TYPE}'/0'`,
  
  // BIP44 - Legacy (B...)
  LEGACY: `m/44'/${BC2_COIN_TYPE}'/0'`,
  
  // BIP86 - Taproot (bc21p...)
  TAPROOT: `m/86'/${BC2_COIN_TYPE}'/0'`,
};

// =============================================================================
// ELECTRUM SERVERS
// =============================================================================

export interface ElectrumServer {
  host: string;
  tcp: number;
  ssl: number;
  protocol?: 'tcp' | 'ssl';
}

/**
 * Default BC2 Electrum servers
 * Add your own Fulcrum/Electrum server here
 */
export const BC2_ELECTRUM_SERVERS: ElectrumServer[] = [
  // Primary BC2 Electrum server
  { host: 'Bitcoin-II.ddns.net', tcp: 50008, ssl: 50009 },
];

/**
 * Electrum server configuration for BlueElectrum
 */
export const BC2_ELECTRUM_CONFIG = {
  defaultPort: 50009,
  defaultProtocol: 'ssl' as const,
  connectionTimeout: 5000,
  pingInterval: 60000,
};

// =============================================================================
// BLOCK EXPLORER
// =============================================================================

export const BC2_EXPLORER = {
  baseUrl: 'https://bc2.live',
  
  // URL builders
  txUrl: (txid: string) => `https://bc2.live/tx/${txid}`,
  addressUrl: (address: string) => `https://bc2.live/address/${address}`,
  blockUrl: (blockHash: string) => `https://bc2.live/block/${blockHash}`,
  blockHeightUrl: (height: number) => `https://bc2.live/block/${height}`,
};

// =============================================================================
// NETWORK PORTS
// =============================================================================

export const BC2_PORTS = {
  p2p: 8444,      // Node P2P communication
  rpc: 8445,      // JSON-RPC
  electrumTcp: 50008,
  electrumSsl: 50009,
};

// =============================================================================
// TRANSACTION CONSTANTS
// =============================================================================

export const BC2_TX = {
  // Default transaction version
  defaultVersion: 2,
  
  // Minimum relay fee (satoshis per byte)
  minRelayFee: 1,
  
  // Default fee rate (satoshis per vbyte)
  defaultFeeRate: 10,
  
  // Dust threshold (satoshis)
  dustThreshold: 546,
  
  // Maximum transaction size (bytes)
  maxTxSize: 100000,
};

// =============================================================================
// BLOCK CONSTANTS
// =============================================================================

export const BC2_BLOCK = {
  // Target block time in seconds
  targetBlockTime: 600, // 10 minutes
  
  // Difficulty adjustment interval
  difficultyAdjustmentInterval: 2016,
  
  // Subsidy halving interval
  halvingInterval: 210000,
  
  // Initial block reward
  initialBlockReward: 50,
  
  // Maximum supply
  maxSupply: 21000000,
};

// =============================================================================
// ADDRESS VALIDATION
// =============================================================================

/**
 * Regular expressions for BC2 address validation
 */
export const BC2_ADDRESS_REGEX = {
  // Native SegWit (bech32) - bc21q...
  nativeSegwit: /^bc21q[ac-hj-np-z02-9]{38,}$/i,
  
  // Taproot (bech32m) - bc21p...
  taproot: /^bc21p[ac-hj-np-z02-9]{38,}$/i,
  
  // Legacy P2PKH - B...
  legacy: /^B[1-9A-HJ-NP-Za-km-z]{25,34}$/,
  
  // P2SH - starts with a specific character based on scriptHash version
  p2sh: /^[2-3][1-9A-HJ-NP-Za-km-z]{25,34}$/,
};

/**
 * Check if an address is valid for BC2
 */
export function isValidBC2Address(address: string): boolean {
  if (!address) return false;
  
  return (
    BC2_ADDRESS_REGEX.nativeSegwit.test(address) ||
    BC2_ADDRESS_REGEX.taproot.test(address) ||
    BC2_ADDRESS_REGEX.legacy.test(address) ||
    BC2_ADDRESS_REGEX.p2sh.test(address)
  );
}

/**
 * Get the type of a BC2 address
 */
export function getBC2AddressType(address: string): string | null {
  if (!address) return null;
  
  if (BC2_ADDRESS_REGEX.nativeSegwit.test(address)) return 'P2WPKH';
  if (BC2_ADDRESS_REGEX.taproot.test(address)) return 'P2TR';
  if (BC2_ADDRESS_REGEX.legacy.test(address)) return 'P2PKH';
  if (BC2_ADDRESS_REGEX.p2sh.test(address)) return 'P2SH';
  
  return null;
}

// =============================================================================
// EXPORT DEFAULT NETWORK
// =============================================================================

export default BC2_MAINNET;
