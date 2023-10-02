const Crypto = (() => {
	let keyPairInstance = null;

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
	// return: ArrayBuffer
	const encodeCipher = async (data, receiverPublicKey) => {
		const key = await window.crypto.subtle.importKey('jwk', receiverPublicKey, {
	    name: "RSA-OAEP",
	    hash: "SHA-256"
	  }, false, ['encrypt']);
		const cipherBytesArray = await window.crypto.subtle.encrypt({
			name: "RSA-OAEP"
		}, key, new TextEncoder().encode(data));
		return cipherBytesArray;
	};

	// cipher: ArrayBuffer
	// return: string
	const decodeCipher = async (cipher) => {
		const decodedCipher = new TextDecoder.decode(await window.crypto.subtle.decrypt({
			name: "RSA-OAEP"
		}, keyPairInstance.privateKey, cipher));
		return decodeCipher;
	};

	return {
		generateKeyPairInstance,
		exportPublicKey,
		encodeCipher,
		decodeCipher,
	};
})();

export default Crypto;
