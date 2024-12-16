import { ethers, Interface, Log } from 'ethers';
import contractABI from '../contractABI/contractABI.json';

export const processLogs = (logs: Log[]): Map<string, bigint> => {
    const balances: Map<string, bigint> = new Map();
    const iface = new Interface(contractABI);

    logs.forEach((log) => {
    try {
        const decoded = iface.parseLog({ topics: log.topics, data: log.data });
        const { name: event, args } = decoded;

        if (event === 'Transfer') {
        const [from, to, amount] = [args[0], args[1], BigInt(args[2])];
        if (from !== ethers.ZeroAddress) {
            balances.set(from, (balances.get(from) || BigInt(0)) - amount);
        }
        balances.set(to, (balances.get(to) || BigInt(0)) + amount);
        } else if (event === 'Mint') {
        const [to, amount] = [args[0], BigInt(args[1])];
        balances.set(to, (balances.get(to) || BigInt(0)) + amount);
        }
    } catch (error) {
        console.error('Error decoding log:', error);
    }
    });

    return balances;
}

