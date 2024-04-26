import axios from 'axios';
import { Command } from 'commander';

const program = new Command();

program
  .requiredOption('-e, --email <email>', 'Email associated with the wallet')
  .requiredOption('-c, --chain <chain>', 'Blockchain to use (default is Base)', 'base')
  .requiredOption('-k, --apiKey <apiKey>', 'Crossmint API Key')
  .requiredOption('-i, --collectionId <collectionId>', 'Collection ID to mint NFT in')
  .option('-n, --nftName <nftName>', 'Name of the NFT', 'Crossmint Example NFT')
  .option('-d, --description <description>', 'Description of the NFT', 'My NFT created via the mint API!')
  .option('-u, --imageUrl <imageUrl>', 'URL of the image for the NFT', 'https://www.crossmint.com/assets/crossmint/logo.png');

program.parse(process.argv);

const options = program.opts();

async function createWallet(email: string, chain: string, apiKey: string) {
  const url = `https://www.crossmint.com/api/v1-alpha1/wallets`;
  const headers = {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
  };
  const body = {
    email,
    chain
  };
  
  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error('Failed to create wallet:', error);
    return null;
  }
}

async function mintNFT(collectionId: string, recipient: string, metadata: any, apiKey: string) {
  const url = `https://www.crossmint.com/api/2022-06-09/collections/${collectionId}/nfts`;
  const headers = {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
  };
  const body = {
    recipient,
    metadata
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error('Failed to mint NFT:', error);
    return null;
  }
}

async function main() {
  const { email, chain, apiKey, collectionId, nftName, description, imageUrl } = options;
  
  console.log(`Creating wallet for email: ${email} on chain: ${chain}`);
  const walletResponse = await createWallet(email, chain, apiKey);
  if (!walletResponse) {
    console.error('Error creating wallet. Exiting...');
    return;
  }

  console.log('Wallet created or retrieved successfully:', walletResponse);

  const recipient = `email:${email}:${chain}`;
  const metadata = {
    name: nftName,
    image: imageUrl,
    description: description
  };

  console.log(`Minting NFT to recipient: ${recipient}`);
  const mintResponse = await mintNFT(collectionId, recipient, metadata, apiKey);
  if (!mintResponse) {
    console.error('Error minting NFT. Exiting...');
    return;
  }

  console.log('NFT minted successfully:', mintResponse);
}

main();
```

### Explanation:
- This script uses the `commander` package to handle command-line arguments and the `axios` package for HTTP requests.
- The `createWallet` function sends a POST request to create a wallet associated with an email on a specified blockchain.
- The `mintNFT` function sends a POST request to mint an NFT to a specified wallet.
- The `main` function orchestrates the workflow: it retrieves command-line options, creates a wallet, and mints an NFT to that wallet.

### Usage:
To run this script, you would execute it from the command line, providing the necessary options. For example:
```bash
ts-node script.ts --email user@example.com --chain base --apiKey YOUR_API_KEY --collectionId YOUR_COLLECTION_ID
