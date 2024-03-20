# End-to-End Encrypted Chat Application

## Overview
This is an end-to-end encrypted chat application developed to provide secure communication between users. The application utilizes a combination of symmetric and asymmetric cryptography for encryption and decryption, ensuring the confidentiality and integrity of messages and files exchanged.
Features

- End-to-End Encryption: All messages and files are encrypted on the sender's device and decrypted only on the recipient's device.
- Hybrid Cryptography: Symmetric key encryption is used for encrypting messages and files, while asymmetric encryption is used for secure key derivation.
- Secure Communication: Communication between users is protected against eavesdropping and tampering.
- User-Friendly Interface: Intuitive user interface for seamless communication and file sharing.

## How It Works
### Symmetric Key Derivation:
- The symmetric key for encrypting messages and files is derived from the sender's private key and the recipient's public key.
- This ensures that only the sender and the intended recipient can decrypt the messages and files exchanged.

### Encryption Process:
- Upon sending a message or file, the sender derives a symmetric key using their private key and the recipient's public key.
- This symmetric key is then used to encrypt the message or file, generating a cipher.

### Decryption Process:
- Upon receiving a cipher, the recipient derives the same symmetric key using the sender's public key and their private key.
- This symmetric key is then used to decrypt the cipher, revealing the original message or file.

### Secure Communication:
- By deriving the symmetric key from the sender's private key and the recipient's public key, the chat application ensures secure end-to-end communication.
- Messages and files are encrypted and decrypted using this symmetric key, providing confidentiality and integrity to the communication.

![thumbnail](https://github.com/MeFaisalAnsari/AnsariChat/assets/84059960/8df00c0f-6bdf-4dbd-8fc1-34f1425b5ec1)
