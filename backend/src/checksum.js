import { crc32 } from 'crc';

const amount = 10; // Replace with the dummy amount you want to test
const privateKey = 'd8bKEaX1XEtB';

// Concatenate amount and private key
const data = amount.toString() + privateKey;
const checksum = crc32(data).toString(); // Calculate the CRC32 checksum

console.log('Checksum:', checksum);
