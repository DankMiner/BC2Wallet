import BIP32Factory, { BIP32Interface } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Psbt } from 'bitcoinjs-lib';
import b58 from 'bs58check';
import { CoinSelectReturnInput } from 'coinselect';

import ecc from '../../blue_modules/noble_ecc';
import { concatUint8Arrays, hexToUint8Array } from '../../blue_modules/uint8array-extras';
import { AbstractHDElectrumWallet } from './abstract-hd-electrum-wallet';
import BC2_MAINNET, { BC2_COIN_TYPE } from '../../blue_modules/bc2-network';

const bip32 = BIP32Factory(ecc);

/**
 * HD Wallet (BIP39).
 * In particular, BIP49 (P2SH Segwit) for BitcoinII (BC2)
 * @see https://github.com/bitcoin/bips/blob/master/bip-0049.mediawiki
 */
export class HDSegwitP2SHWallet extends AbstractHDElectrumWallet {
  static readonly type = 'HDsegwitP2SH';
  static readonly typeReadable = 'HD SegWit (BIP49 P2SH)';
  // @ts-ignore: override
  public readonly type = HDSegwitP2SHWallet.type;
  // @ts-ignore: override
  public readonly typeReadable = HDSegwitP2SHWallet.typeReadable;
  public readonly segwitType = 'p2sh(p2wpkh)';

  // BC2 derivation path: m/49'/2'/0' (coin type 2 for BC2)
  static readonly derivationPath = `m/49'/${BC2_COIN_TYPE}'/0'`;

  /**
   * Returns the BC2 network configuration for address generation
   */
  getNetwork() {
    return BC2_MAINNET;
  }

  allowSend() {
    return true;
  }

  allowCosignPsbt() {
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

  _hdNodeToAddress(hdNode: BIP32Interface): string {
    return this._nodeToP2shSegwitAddress(hdNode);
  }

  /**
   * Returning ypub actually, not xpub. Keeping same method name
   * for compatibility.
   *
   * @return {String} ypub
   */
  getXpub() {
    if (this._xpub) {
      return this._xpub; // cache hit
    }
    // first, getting xpub
    const seed = this._getSeed();
    const root = bip32.fromSeed(seed, this.getNetwork());

    const path = this.getDerivationPath();
    if (!path) {
      throw new Error('Internal error: no path');
    }
    const child = root.derivePath(path).neutered();
    const xpub = child.toBase58();

    // bitcoinjs does not support ypub yet, so we just convert it from xpub
    // Note: For BC2, we use the same ypub prefix (049d7cb2) as this is standard BIP49
    let data = b58.decode(xpub);
    data = data.slice(4);
    const concatenated = concatUint8Arrays([hexToUint8Array('049d7cb2'), data]);
    this._xpub = b58.encode(concatenated);

    return this._xpub;
  }

  _addPsbtInput(psbt: Psbt, input: CoinSelectReturnInput, sequence: number, masterFingerprintBuffer: Uint8Array) {
    if (!input.address) {
      throw new Error('Internal error: no address on Utxo during _addPsbtInput()');
    }
    const pubkey = this._getPubkeyByAddress(input.address);
    const path = this._getDerivationPathByAddress(input.address);
    if (!pubkey || !path) {
      throw new Error('Internal error: pubkey or path are invalid');
    }

    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey, network: this.getNetwork() });
    const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: this.getNetwork() });

    if (!p2sh.output) {
      throw new Error('Internal error: no p2sh.output during _addPsbtInput()');
    }

    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      sequence,
      bip32Derivation: [
        {
          masterFingerprint: masterFingerprintBuffer,
          path,
          pubkey,
        },
      ],
      witnessUtxo: {
        script: p2sh.output,
        value: BigInt(input.value),
      },
      redeemScript: p2wpkh.output,
    });

    return psbt;
  }

  isSegwit() {
    return true;
  }

  allowSilentPaymentSend(): boolean {
    return false; // Disabled for BC2 - no Silent Payments support yet
  }
}
