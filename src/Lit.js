import * as LitJsSdk from '@lit-protocol/lit-node-client'
import nftConfig from '~/nftConfig.json'

const client = new LitJsSdk.LitNodeClient()
// TODO: update chain to xdai (or whatever equivalent to)
const chain = 'goerli'

// Checks if the user owns the token
const accessControlConditions = (contractName, tokenId) => [
  {
    contractAddress: nftConfig[contractName].address,
    standardContractType: 'ERC721',
    chain,
    method: 'ownerOf',
    parameters: [tokenId],
    returnValueTest: {
      comparator: '=',
      value: ':userAddress',
    },
  },
]

class Lit {
  litNodeClient

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }

  async encryptObject(contractName, objToEncrypt, nftTotalSupply) {
    if (!this.litNodeClient) {
      await this.connect() // Connect to Lit Network if not already
    }

    try {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        JSON.stringify(objToEncrypt)
      )

      const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
        accessControlConditions: accessControlConditions(
          contractName,
          nftTotalSupply
        ),
        symmetricKey,
        authSig,
        chain,
      })

      return {
        encryptedString: await LitJsSdk.blobToBase64String(encryptedString),
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
          encryptedSymmetricKey,
          'base16'
        ),
      }
    } catch {
      LitJsSdk.disconnectWeb3()
    }
  }

  async decryptText(
    contractName,
    encryptedString,
    encryptedSymmetricKey,
    nftTotalSupply
  ) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditions(
        contractName,
        nftTotalSupply
      ),
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    })

    const decryptString = await LitJsSdk.decryptString(
      LitJsSdk.base64StringToBlob(encryptedString),
      symmetricKey
    )

    return JSON.parse(decryptString)
  }

  async encryptFile(contractName, fileToEncrypt, nftTotalSupply) {
    if (!this.litNodeClient) {
      await this.connect() // Connect to Lit Network if not already
    }

    console.log(nftConfig[contractName].address)

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({
      file: fileToEncrypt,
    })

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions(
        contractName,
        nftTotalSupply
      ),
      symmetricKey,
      authSig,
      chain,
    })

    return {
      encryptedFile: await LitJsSdk.blobToBase64String(encryptedFile),
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      ),
    }
  }

  async decryptFile(
    contractName,
    encryptedImage,
    encryptedSymmetricKey,
    nftTotalSupply
  ) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditions(
        contractName,
        nftTotalSupply
      ),
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    })

    const file = LitJsSdk.base64StringToBlob(encryptedImage)
    const decryptFile = await LitJsSdk.decryptFile({ file, symmetricKey })

    return decryptFile
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Lit()
