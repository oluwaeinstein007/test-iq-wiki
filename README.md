<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# README - Token Holders API (NestJS)

## Project Objective

To create an **API** that retrieves and maintains a list of all holders of a specific ERC-20 token. This involves:

1. Fetching token mint and transfer events.
2. Updating user balances in near real-time.
3. Providing a reliable and efficient endpoint to query token holders.

### Token Address

**FraxScan** URL: [0xdcc0f2d8f90fde85b10ac1c8ab57dc0ae946a543](https://fraxscan.com/token/0xdcc0f2d8f90fde85b10ac1c8ab57dc0ae946a543)

---

## Thought Process

### Initial Approach

- **Using Fraxscan API**: I used the franxscan API to fetch token events but due to rate Limit, "No records found" was returned, I had to use RPC to fetch the events directly from the node.
- **Decoding**: I initially used Viem to decode the logs but I had to switch to ethers.js to decode the logs for the events due to more flexibility and ease of use.

### Final Implementation

-**Fetching Blocks**: I first got the timestamp of the last record on the address, used that to get the block number (using get Block by timestamp api from fraxscan) set that as fromBlock and then added 25days to the initial timestamp to get the toBlock and then ran that in a loop till when "+25days" is greater than the current timestamp in which I set toBlock to "latest". -**Saving the Timestamp and Block Number**: I saved the timestamp and block number to the database to avoid fetching the same logs again and increasing efficiency and reducing the number of requests to the node. -**Get Logs from RPC**: I used the getLogs method from ethers.js to get the logs from the node. -**Decoding Logs**: I decoded the logs using the abi of the contract.

- **Event Handling**:
  - Process each `Transfer` event:
    1.  Deduct tokens from the sender.
    2.  Add tokens to the receiver.
    3.  Remove holders with zero balance.
- **Real-time Updates**:
  - The key challenge was achieving near real-time updates without overloading the API.
  - I decided to implement polling (every few minute ie 5mins) as a balance between real-time updates and API rate limits.
- **Database Design**:
  - A simple table structure with `address` and `balance` columns to minimize complexity.
  - Indexing the `address` field ensures fast lookups and updates.

### Challenges

1. **Real-Time vs. Rate Limits**:
   - Polling too frequently might trigger API rate limits. Implementing retries with exponential backoff would improve resilience.
2. **Data Integrity**:
   - Ensuring accurate balance calculations required careful handling of events.
3. **Record Limit (ie 1000 blocks per request)**:
   - I used 25 days to avoid this issue but it was quite a guess of average max transactions vs time.

### What Can Be Better

1. **WebSocket Integration**:
   - Instead of polling, integrating WebSockets (if supported by the blockchain node) would achieve true real-time updates.
2. **Transaction Data Integrity**:
   - While the current method works fine, adding additional checks for transaction integrity could improve reliability ie storing and checking transaction hashes for duplicates to prevent holder balance discrepancies.
3. **Scalability**:
   - For high token transfer volumes, batch processing and bulk database updates could improve performance.
4. **Error Handling**:
   - Adding robust error handling and retries for API failures or database connection issues.

---

## Technology Stack

1. **Backend Framework**: [NestJS](https://nestjs.com)
2. **Database**: MySQL deployed on [FreeMySQlDatabase] (https://www.freesqldatabase.com/)
3. **Data Fetching**: [RPC] (https://rpc.frax.com/)
4. **Deployment**: Vercel
5. **Testing**: Jest
6. **Version Control**: GitHub

---

## Features

1. **Real-time Updates**:
   - Fetches token `mint` and `transfer` events in real time.
   - Updates user balances dynamically.
2. **Token Holders Endpoint**:
   - Provides a RESTful API endpoint to fetch the list of token holders and their respective balances.
3. **Database Optimization**:
   - Efficient handling of balance updates.
   - Indexed queries to retrieve token holders quickly.
4. **Code Documentation**:
   - Proper inline and method-level documentation for clarity.
5. **Tests**:
   - Includes test coverage for core logic (event fetching, database updates, API responses).

---

## API Documentation

### Base URL

```
https://your-api-url.com/api/v1
```

---

## How It Works

### Workflow

1. **Fetching Token Events**:
   - Use FRPC to fetch transactions and filter for token `Transfer` and `Mint` events.
   - Poll the API at regular intervals to simulate real-time updates.
2. **Processing Events**:
   - On each event:
     - Update the sender's and receiver's balances.
     - If the balance reaches zero, remove the holder from the database.
3. **Database Storage**:
   - Balances are stored in PostgreSQL with a structure:
     ```sql
     CREATE TABLE token_holders (
       address VARCHAR PRIMARY KEY,
       balance NUMERIC
     );
     ```
4. **API Exposure**:
   - Expose a RESTful endpoint to retrieve token holders.

---

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/oluwaeinstein007/test-iq-wiki.git
   ```

   ### Project setup

   ```bash
   $ npm install
   ```

   ###Set up environment variables:

   - Create a `.env` file in the project root:
     ```
        DB_HOST=localhost
        DB_PORT=3306
        DB_USERNAME=root
        DB_PASSWORD=
        DB_NAME=TestIQWiki
        FraxApiKey=xxxxx...
        BaseURL=https://rpc.frax.com/
     ```

   ### Compile and run the project

   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev

   # production mode
   $ npm run start:prod
   ```

   ### Run tests

   ```bash
   # unit tests
   $ npm run test

   # e2e tests
   $ npm run test:e2e

   # test coverage
   $ npm run test:cov
   ```

---

## Next Steps

1. Refactor code for improved scalability (bulk inserts/updates).
2. Explore direct blockchain node connections.
3. Implement WebSocket support for real-time updates.
4. Add pagination to the token holders endpoint for large datasets.

---

## Deployment

1. Deploy the application on **Vercel**.

---

## Contact

For questions or clarifications, feel free to reach out:

- **Name**: Lanre Sanni
- **Email**: slanre26@gmail.com

---

## Conclusion

This project demonstrates a practical approach to building a token holders API using **NestJS** with near real-time updates. While polling provides a functional solution, exploring WebSocket integration or direct node queries could further improve efficiency and scalability.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# test-iq-wiki
