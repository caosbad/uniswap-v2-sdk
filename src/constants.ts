import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import validateAndParseAddress from './utils/validateAndParseAddress'

export const FACTORY_ADDRESS = '0xB296bAb2ED122a85977423b602DdF3527582A3DA'

export const INIT_CODE_HASH = '0xbfcdf7952c4cf2567d8f116cdb22d604f4c8e40ea2688efdb344d56910a189d8'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const FIVE = JSBI.BigInt(5)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  KUCHAIN_TEST = 322
}

export class Currency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  /**
   * The only instance of the base class `Currency`.
   */
  public static readonly ETHER: Currency = new Currency(18, 'ETH', 'Ether')

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(decimals: number, symbol?: string, name?: string) {
    invariant(decimals < 255, 'DECIMALS')

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}

export class Token extends Currency {
  public readonly chainId: ChainId | number
  public readonly address: string

  public constructor(chainId: ChainId | number, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

export const WETH9: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xE13649525AB1AbD4487037a8Bb961ab8cE4B7314',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xE13649525AB1AbD4487037a8Bb961ab8cE4B7314',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xE13649525AB1AbD4487037a8Bb961ab8cE4B7314', 18, 'WETH9', 'Wrapped Ether'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xE13649525AB1AbD4487037a8Bb961ab8cE4B7314', 18, 'WETH9', 'Wrapped Ether'),
  [ChainId.KUCHAIN_TEST]: new Token(ChainId.KUCHAIN_TEST, '0x4437F4d5671Cce47784986375cd48Dd12Ad57C55', 18, 'WETH9', 'Wrapped Ether')
}
