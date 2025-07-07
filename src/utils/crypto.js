const Crypto = (() => {
  const IV_LENGTH = 12;

  // key: CryptoKey
  // return: exported key in jwk format
  const exportKey = async (key) => {
    const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
    return exportedKey;
  };

  // jwk: exported key in jwk format
  // return: CryptoKey
  const importKey = async (jwk) => {
    const importedKey = await window.crypto.subtle.importKey(
      'jwk',
      jwk,
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      true,
      []
    );
    return importedKey;
  }

  // publicKey: CryptoKey, privateKey: CryptoKey
  // return: CryptoKey
  const deriveKey =  async (publicKey, privateKey) => {
    const sharedKey = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: publicKey,
      },
      privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt"]
    );
    return sharedKey;
  }

  // return: CryptoKey object with asymmetric keyPair
  const generateKeyPairInstance = async () => {
    const newKeyPairInstance = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      false,
      ["deriveKey"]
    );
    return newKeyPairInstance;
  };

  // data: Object, receiverJwk: asymmetric public-key in (jwk) format, senderPrivateKey: CryptoKey
  // return: ArrayBuffer
  const encodeCipher = async (data, receiverJwk, senderPrivateKey) => {
    const receiverPublicKey = await importKey(receiverJwk);
    const secretKey = await deriveKey(receiverPublicKey, senderPrivateKey)
    const initializationVector = window.crypto.getRandomValues(
      new Uint8Array(IV_LENGTH)
    );
    const cipherBytesArray = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: initializationVector },
      secretKey,
      objectToBytes(data)
    );
    return bundleIvCipher(initializationVector, cipherBytesArray);
  };

  // cipher: ArrayBuffer, receiverPrivateKey: CryptoKey, senderJwk: asymmetric public-key in (jwk) format
  // return: Object
  const decodeCipher = async (cipher, receiverPrivateKey, senderJwk) => {
    try {
      const publicKey = await importKey(senderJwk);
      const secretKey = await deriveKey(publicKey, receiverPrivateKey);
      const [iv, cipherBytes] = unbundleIvCipher(cipher);
      const decodedCipher = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv
        },
        secretKey,
        cipherBytes
      );
      return bytesToObject(decodedCipher);
    } catch (error) {
      throw new Error("Failed to decrypt cipher.");
    }
  };

  // object: Object
  // return: Uint8Array
  const objectToBytes = (object) => {
    return new TextEncoder().encode(JSON.stringify(object));
  }

  // bytes: ArrayBuffer
  // return: Object
  const bytesToObject = (bytes) => {
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  // iv: Uint8Array, cipherBytesArray: ArrayBuffer
  // return: ArrayBuffer
  const bundleIvCipher = (iv, cipherBytesArray) => {
    const outBytes = new Uint8Array(iv.length + cipherBytesArray.length);
    outBytes.set(iv, 0);
    outBytes.set(cipherBytesArray, iv.length);
    return outBytes.buffer;
  }

  // bundleBytes: ArrayBuffer
  // return: [Uint8Array, Uint8Array]
  const unbundleIvCipher = (bundleBytes) => {
    const bundle = new Uint8Array(bundleBytes);
    const iv = bundle.slice(0, IV_LENGTH);
    const cipher = bundle.slice(IV_LENGTH);
    return [iv, cipher];
  }

  return {
    generateKeyPairInstance,
    exportKey,
    importKey,
    deriveKey,
    encodeCipher,
    decodeCipher,
    utils: {
      objectToBytes,
      bytesToObject,
      bundleIvCipher,
      unbundleIvCipher
    }
  };
})();

export default Crypto;
