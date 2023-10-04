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
		    name: "RSA-OAEP",
		    modulusLength: 4096,
		    publicExponent: new Uint8Array([1, 0, 1]),
		    hash: "SHA-256"
		  },
		  false,
		  ["decrypt", "encrypt"]
		);
		return newKeyPairInstance;
	};

	// data: string, receiverPublicKey: asymmetric public-key in (jwk) format
	// return: base64
	const encodeCipher = async (data, receiverPublicKey) => {
		const key = await window.crypto.subtle.importKey('jwk', receiverPublicKey, {
	    name: "RSA-OAEP",
	    hash: "SHA-256"
	  }, true, ['encrypt']);
		const cipherBytesArray = await window.crypto.subtle.encrypt({
			name: "RSA-OAEP"
		}, key, new TextEncoder().encode(data));
		return arrayBufferToBase64(cipherBytesArray);
	};

	// cipher: base64
	// return: object
	const decodeCipher = async (cipher, receiverPrivateKey) => {
		const decodedCipher = await window.crypto.subtle.decrypt({
			name: "RSA-OAEP"
		}, receiverPrivateKey, base64ToArrayBuffer(cipher));
		return new TextDecoder().decode(decodedCipher);
	};

	// ciphers: array[base64]
	// return: array[object]
	const decodeAllCiphers = async (ciphers, receiverPrivateKey) => {
		const promises = [];
		ciphers.forEach(cipher => promises.push(decodeCipher(cipher, receiverPrivateKey)));
		return Promise.all(promises);
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
