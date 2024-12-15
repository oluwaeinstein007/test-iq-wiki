// async getLogs(address: string, topic0: string): Promise<any> {
    //     try {
    //       const url = `${this.API_BASE_URL}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${address}&&apikey=${this.API_KEY}`;

    //       // Make the HTTP request
    //       const response = await axios.get(url);

    //       // Handle API-level errors
    //       if (response.data.status !== '1') {
    //         throw new HttpException(
    //           response.data.message || 'Failed to fetch transactions',
    //           HttpStatus.BAD_REQUEST,
    //         );
    //       }

    //       // Return formatted response
    //       return {
    //         message: 'Transactions fetched successfully',
    //         transactions: response.data.result, // Include only the 'result' field
    //       };
    //     } catch (error) {
    //       // Catch errors and provide a meaningful fallback message
    //       const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch transactions';
    //       throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }


//     import { ethers, Interface, Log } from 'ethers';
// import { HttpException, HttpStatus } from '@nestjs/common';
// import contractABI from './contractABI.json';



// async getLogs(address: string, topic0: string): Promise<any> {
    //   try {
    //       const url = `${this.API_BASE_URL}?module=logs&action=getLogs&fromBlock=1487238&toBlock=2251093&address=${address}&apikey=${this.API_KEY}`;

    //       // Make the HTTP request
    //       const response = await axios.get(url);
    //       // return url;

    //       // Handle API-level errors
    //       if (response.data.status !== '1') {
    //           throw new HttpException(
    //               response.data.message || 'Failed to fetch logs',
    //               HttpStatus.BAD_REQUEST,
    //           );
    //       }

    //       // return null;

    //       const logs = response.data.result;

    //       // return "hello";

    //       // Decode each log
    //       const decodedLogs = logs.map((log: any) => {
    //           try {
    //               const decodedLog = decodeEventLog({
    //                   abi: contractABI,
    //                   data: log.data,
    //                   topics: log.topics,
    //               });
    //               return decodedLog; // Successfully decoded log
    //           } catch (error) {
    //               console.error('Error decoding log:', error);
    //               return null; // Handle failed decoding
    //           }
    //       });

    //       // Filter out any null values from failed decoding
    //       const validDecodedLogs = decodedLogs.filter(Boolean);

    //       // Transform BigInt values to strings (if any BigInt is present in decoded logs)
    //       const transformedLogs = validDecodedLogs.map((log) =>
    //         JSON.parse(
    //             JSON.stringify(log, (key, value) =>
    //                 typeof value === 'bigint' ? value.toString() : value,
    //             ),
    //         ),
    //     );

    //       // Save decoded logs to the database (optional)
    //       // for (const decodedLog of validDecodedLogs) {
    //       //   const holder = this.holdersRepository.create({ address, balance: JSON.stringify(decodedLog)});
    //       //   await this.holdersRepository.save(holder);
    //       // }

    //       return {
    //           message: 'Logs fetched and decoded successfully',
    //           decodedLogs: transformedLogs,
    //       };
    //   } catch (error) {
    //       const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch logs';
    //       // console.log (error);
    //       // return "chai";
    //       throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    //   }
    // }


    

    // async getLogs(address: string, topic0: string): Promise<any> {
    //     try {
    //         // Initialize the ethers provider
    //         const provider = new ethers.JsonRpcProvider(process.env.BaseURL);

    //         // Define the filter for fetching logs
    //         const filter = {
    //             address: address,
    //             fromBlock: 1487238, // Starting block
    //             toBlock: 2251093,   // Ending block
    //             topics: [topic0],   // Filter by topic0 (event signature)
    //         };

    //         // Fetch logs using ethers provider
    //         const logs: Log[] = await provider.getLogs(filter);

    //         // Initialize the interface for decoding logs
    //         const iface = new Interface(contractABI);

    //         // Decode and transform logs
    //         const decodedLogs = logs.map((log: Log) => {
    //             try {
    //                 const decoded = iface.parseLog({
    //                     topics: log.topics,
    //                     data: log.data,
    //                 });

    //                 // Transform BigInt values to strings
    //                 const transformed = JSON.parse(
    //                     JSON.stringify(decoded.args, (key, value) =>
    //                         typeof value === 'bigint' ? value.toString() : value,
    //                     ),
    //                 );

    //                 return {
    //                     event: decoded.name,
    //                     args: transformed,
    //                     logIndex: log.logIndex,
    //                     blockNumber: log.blockNumber,
    //                     transactionHash: log.transactionHash,
    //                 };
    //             } catch (error) {
    //                 console.error('Error decoding log:', error);
    //                 return null; // Handle failed decoding
    //             }
    //         });

    //         // Filter out null (failed decodings)
    //         const validDecodedLogs = decodedLogs.filter(Boolean);

    //         return {
    //             message: 'Logs fetched and decoded successfully',
    //             decodedLogs: validDecodedLogs,
    //         };
    //     } catch (error) {
    //         const errorMessage =
    //             error.message || 'Failed to fetch logs using ethers';
    //         throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

//here
    // async getLogs(address: string, topic0: string): Promise<any> {
    //     try {
    //         // Initialize the ethers provider
    //         const provider = new ethers.JsonRpcProvider(process.env.BaseURL);

    //         // Define the filter for fetching logs
    //         const filter = {
    //             address: address,
    //             fromBlock: 1487238, // Starting block
    //             toBlock: 2251093,   // Ending block
    //         };

    //         // Fetch logs using ethers provider
    //         const logs: Log[] = await provider.getLogs(filter);

    //         // Initialize the interface for decoding logs
    //         const iface = new Interface(contractABI);

    //         // Decode and transform logs
    //         const decodedLogs = logs.map((log: Log) => {
    //             try {
    //                 const decoded = iface.parseLog({
    //                     topics: log.topics,
    //                     data: log.data,
    //                 });

    //                 // Transform BigInt values to strings
    //                 const transformed = JSON.parse(
    //                     JSON.stringify(decoded.args, (key, value) =>
    //                         typeof value === 'bigint' ? value.toString() : value,
    //                     ),
    //                 );

    //                 return {
    //                     event: decoded.name,
    //                     args: transformed,
    //                     // logIndex: log.logIndex,
    //                     blockNumber: log.blockNumber,
    //                     transactionHash: log.transactionHash,
    //                 };
    //             } catch (error) {
    //                 console.error('Error decoding log:', error);
    //                 return null; // Handle failed decoding
    //             }
    //         });

    //         // Filter out null (failed decodings)
    //         const validDecodedLogs = decodedLogs.filter(Boolean);

    //         return {
    //             message: 'Logs fetched and decoded successfully',
    //             decodedLogs: validDecodedLogs,
    //         };
    //     } catch (error) {
    //         const errorMessage =
    //             error.message || 'Failed to fetch logs using ethers';
    //         throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    ///Latest code

    // async getLogs(address: string, topic0: string): Promise<any> {
    //     try {
    //       // Initialize ethers provider
    //       const provider = new ethers.JsonRpcProvider(process.env.BaseURL);
      
    //       // Define constants for timestamp increments
    //       const secondsIn25Days = 25 * 24 * 60 * 60;
    //       let currentTimestamp = 1709785187; // Starting timestamp
    //       let currentBlock: number | undefined;
      
    //       while (true) {
    //         // Get the starting block using the current timestamp
    //         const fromBlock = await this.getBlockByTimestamp(currentTimestamp);
    //         if (!fromBlock) throw new Error('Failed to fetch the starting block.');
      
    //         // Calculate the next timestamp (25 days later) and get the corresponding block
    //         const nextTimestamp = currentTimestamp + secondsIn25Days;
      
    //         // Check if nextTimestamp is in the future
    //         const currentTime = Math.floor(Date.now() / 1000); // Current timestamp
    //         const toBlock = nextTimestamp > currentTime 
    //           ? 'latest' // If the next timestamp is in the future, use 'latest'
    //           : await this.getBlockByTimestamp(nextTimestamp); // Else, fetch the block by timestamp
      
    //         if (toBlock === 'latest' || !toBlock) {
    //           // Use 'latest' if the block couldn't be fetched for the future timestamp
    //           console.log('Using latest block due to future timestamp');
    //         } else if (!toBlock) {
    //           throw new Error('Failed to fetch the ending block.');
    //         }
      
    //         // Set up the filter for fetching logs
    //         const filter = {
    //           address,
    //           topics: [topic0],
    //           fromBlock,
    //           toBlock,
    //         };
      
    //         // Fetch logs
    //         console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);
    //         const logs: Log[] = await provider.getLogs(filter);
    //         const iface = new Interface(contractABI);
      
    //         // Map to store balances
    //         const balances: Map<string, bigint> = new Map();
      
    //         // Process logs
    //         logs.forEach((log: Log) => {
    //           try {
    //             const decoded = iface.parseLog({
    //               topics: log.topics,
    //               data: log.data,
    //             });
      
    //             const { name: event, args } = decoded;
      
    //             if (event === 'Transfer') {
    //               const from = args[0];
    //               const to = args[1];
    //               const amount = BigInt(args[2]);
      
    //               // Deduct balance from 'from' address
    //               if (from !== ethers.ZeroAddress) {
    //                 balances.set(from, (balances.get(from) || BigInt(0)) - amount);
    //               }
      
    //               // Add balance to 'to' address
    //               balances.set(to, (balances.get(to) || BigInt(0)) + amount);
    //             } else if (event === 'Mint') {
    //               const to = args[0];
    //               const amount = BigInt(args[1]);
      
    //               // Add balance to 'to' address
    //               balances.set(to, (balances.get(to) || BigInt(0)) + amount);
    //             }
    //           } catch (error) {
    //             console.error('Error decoding log:', error);
    //           }
    //         });
      
    //         // Save balances to the database
    //         await this.saveBalancesToDatabase(balances);
      
    //         // Update timestamp for the next iteration
    //         currentTimestamp = nextTimestamp;
      
    //         // Exit the loop if we've reached the latest block
    //         const latestBlock = await provider.getBlockNumber();
    //         if (toBlock === 'latest' || toBlock >= latestBlock) break;
    //       }
      
    //       return {
    //         message: 'Logs fetched, balances calculated, and saved successfully',
    //       };
    //     } catch (error) {
    //       console.error('Error fetching logs or saving balance:', error);
    //       throw new Error('Failed to fetch logs or save balances');
    //     }
    //   }
      
    //   // Function to get a block number by timestamp
    //   private async getBlockByTimestamp(timestamp: number): Promise<number | undefined> {
    //     try {
    //       const apiKey = process.env.FraxApiKey;
    
    //       const url = `https://api.fraxscan.com/api`;
    //       const params = {
    //         module: 'block',
    //         action: 'getblocknobytime',
    //         timestamp,
    //         closest: 'before',
    //         apikey: apiKey,
    //       };
    
    //       // Make the API request
    //       const response = await axios.get(url, { params });
    
    //       // Return the block number
    //       if (response.data && response.data.status === '1') {
    //         return parseInt(response.data.result, 10);
    //       } else {
    //         console.error('Error fetching block by timestamp:', response.data.message || 'Unknown error occurred');
    //         return undefined;
    //       }
    //     } catch (error) {
    //       console.error('Error fetching block by timestamp:', error);
    //       return undefined;
    //     }
    //   }
    
    //   // Separate function to save balances to the database
    //   private async saveBalancesToDatabase(balances: Map<string, bigint>) {
    //     for (const [holderAddress, balance] of balances.entries()) {
    //       const existingHolder = await this.holdersRepository.findOne({
    //         where: { address: holderAddress },
    //       });
    
    //       if (existingHolder) {
    //         existingHolder.balance =
    //           parseFloat(existingHolder.balance.toString()) +
    //           parseFloat(balance.toString());
    //         await this.holdersRepository.save(existingHolder);
    //       } else {
    //         const newHolder = this.holdersRepository.create({
    //           address: holderAddress,
    //           balance: parseFloat(balance.toString()),
    //         });
    //         await this.holdersRepository.save(newHolder);
    //       }
    //     }
    //   }