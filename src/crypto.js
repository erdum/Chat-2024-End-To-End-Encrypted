import IndexedDB from "./indexedDB";

const Crypto = (() => {
	let keyPairInstance = null;

	// uid: user unique id, returns exported public key in jwk format
	const exportPublicKey = async (uid) => {
		const db = await IndexedDB.initialize();
		keyPairInstance = await IndexedDB.getCryptoInstance(db, uid);

		if (keyPairInstance === null) {
			keyPairInstance = await window.crypto.subtle.generateKey(
				{
			    name: "RSA-OAEP",
			    modulusLength: 4096,
			    publicExponent: new Uint8Array([1, 0, 1]),
			    hash: "SHA-256"
			  },
			  false,
			  ["decrypt", "encrypt"]
			);
			const exportPublicKey = await window.crypto.subtle.exportKey('jwk', keyPairInstance.publicKey);
			await IndexedDB.saveCryptoInstance(db, structuredClone(keyPairInstance), uid);
			return exportPublicKey;
		} else {
			const exportPublicKey = await window.crypto.subtle.exportKey('jwk', keyPairInstance.publicKey);
			return exportPublicKey;
		}
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
		exportPublicKey,
		encodeCipher,
		decodeCipher,
	};
})();

export default Crypto;
