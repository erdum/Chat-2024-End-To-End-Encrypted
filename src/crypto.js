const Crypto = (() => {
  // publicKey: CryptoKey, returns exported public key in jwk format
  const exportPublicKey = async (publicKey) => {
    const exportPublicKey = await window.crypto.subtle.exportKey('jwk', publicKey);
    return exportPublicKey;
  };

  // return CryptoKey object with asymmetric keyPair
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

  // data: string, receiverPublicKey: asymmetric public-key in (jwk) format, senderPrivateKey: CryptoKey
  // return: base64
  const encodeCipher = async (data, receiverPublicKey, senderPrivateKey) => {
    const publicKey = await window.crypto.subtle.importKey('jwk', receiverPublicKey, {
      name: "ECDH",
      namedCurve: "P-384",
    }, true, []);
    const secretKey = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: publicKey,
      },
      senderPrivateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt"]
    );
    const initializationVector = window.crypto.getRandomValues(new Uint8Array(96));
    const cipherBytesArray = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: initializationVector },
    secretKey,
    new TextEncoder().encode(data));
    return arrayBufferToBase64(initializationVector) + "\n" + arrayBufferToBase64(cipherBytesArray);
  };

  // data: base64, receiverPrivateKey: CryptoKey, senderPublicKey: asymmetric public-key in (jwk) format
  // return: string
  const decodeCipher = async (data, receiverPrivateKey, senderPublicKey) => {
    try {
      const dataComps = data.split("\n");
      const initializationVector = base64ToArrayBuffer(dataComps[0]);
      const cipherText = dataComps[1];
      const publicKey = await window.crypto.subtle.importKey('jwk', senderPublicKey, {
        name: "ECDH",
        namedCurve: "P-384",
      }, true, []);
      const agreedKey = await window.crypto.subtle.deriveKey(
        {
          name: "ECDH",
          public: publicKey,
        },
        receiverPrivateKey,
        {
          name: "AES-GCM",
          length: 256,
        },
        false,
        ["decrypt"]
      );
      const decodedCipher = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: initializationVector
        },
        agreedKey,
        base64ToArrayBuffer(cipherText)
      );
      return new TextDecoder().decode(decodedCipher);
    } catch {
      throw new Error("Failed to decrypt cipher, invalid key");
    }
  };

  // data: array[base64], receiverPrivateKey: CryptoKey, senderPublicKey: asymmetric public-key in (jwk) format
  // return: array[string]
  const decodeAllCiphers = async (ciphers, receiverPrivateKey, senderPublicKey) => {
    const promises = [];
    ciphers.forEach(data => promises.push(decodeCipher(data, receiverPrivateKey, senderPublicKey)));
    const results = await Promise.all(promises.map(p => p.catch(e => e)));
    return results.filter(result => !(result instanceof Error));
  };

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const base64ToArrayBuffer = (base64) => {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  return {
    generateKeyPairInstance,
    exportPublicKey,
    encodeCipher,
    decodeCipher,
    decodeAllCiphers,
  };
})();

export default Crypto;
