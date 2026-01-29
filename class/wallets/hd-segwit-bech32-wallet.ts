import { AbstractHDElectrumWallet } from './abstract-hd-electrum-wallet';
import BC2_MAINNET, { BC2_COIN_TYPE } from '../../blue_modules/bc2-network';

/**
 * HD Wallet (BIP39).
 * In particular, BIP84 (Bech32 Native Segwit) for BitcoinII (BC2)
 * @see https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki
 */
export class HDSegwitBech32Wallet extends AbstractHDElectrumWallet {
  static readonly type = 'HDsegwitBech32';
  static readonly typeReadable = 'HD SegWit (BIP84 Bech32 Native)';
  // @ts-ignore: override
  public readonly type = HDSegwitBech32Wallet.type;
  // @ts-ignore: override
  public readonly typeReadable = HDSegwitBech32Wallet.typeReadable;
  public readonly segwitType = 'p2wpkh';

  // BC2 derivation path: m/84'/2'/0' (coin type 2 for BC2)
  static readonly derivationPath = `m/84'/${BC2_COIN_TYPE}'/0'`;

  /**
   * Returns the BC2 network configuration for address generation
   */
  getNetwork() {
    return BC2_MAINNET;
  }

  allowSend() {
    return true;
  }

  allowRBF() {
    return true;
  }

  allowPayJoin() {
    return false; // Disabled for BC2 - no PayJoin support yet
  }

  allowCosignPsbt() {
    return true;
  }

  isSegwit() {
    return true;
  }

  allowSignVerifyMessage() {
    return true;
  }

  allowMasterFingerprint() {
    return true;
  }

  allowXpub() {
    return true;
  }

  allowBIP47() {
    return false; // Disabled for BC2 - no BIP47 support yet
  }

  allowSilentPaymentSend(): boolean {
    return false; // Disabled for BC2 - no Silent Payments support yet
  }
}
