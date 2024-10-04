import { MerkleTree, MerkleWitness } from 'o1js';
import { Witness } from './base-storage';

export const SUPPORTED_HEIGHTS = [2, 3, 4, 5, 6, 8, 10, 16, 32, 64, 128, 255];

export class MTWitness2 extends MerkleWitness(2) {}
export const NewMTWitness2 = (wtn: Witness) => new MTWitness2(wtn);
export const EmptyMT2 = () => new MerkleTree(2);

export class MTWitness3 extends MerkleWitness(3) {}
export const NewMTWitness3 = (wtn: Witness) => new MTWitness3(wtn);
export const EmptyMT3 = () => new MerkleTree(3);

export class MTWitness4 extends MerkleWitness(4) {}
export const NewMTWitness4 = (wtn: Witness) => new MTWitness4(wtn);
export const EmptyMT4 = () => new MerkleTree(4);

export class MTWitness5 extends MerkleWitness(5) {}
export const NewMTWitness5 = (wtn: Witness) => new MTWitness5(wtn);
export const EmptyMT5 = () => new MerkleTree(5);

export class MTWitness6 extends MerkleWitness(6) {}
export const NewMTWitness6 = (wtn: Witness) => new MTWitness6(wtn);
export const EmptyMT6 = () => new MerkleTree(6);

export class MTWitness8 extends MerkleWitness(8) {}
export const NewMTWitness8 = (wtn: Witness) => new MTWitness8(wtn);
export const EmptyMT8 = () => new MerkleTree(8);

export class MTWitness10 extends MerkleWitness(10) {}
export const NewMTWitness10 = (wtn: Witness) => new MTWitness10(wtn);
export const EmptyMT10 = () => new MerkleTree(10);

export class MTWitness16 extends MerkleWitness(16) {}
export const NewMTWitness16 = (wtn: Witness) => new MTWitness16(wtn);
export const EmptyMT16 = () => new MerkleTree(16);

export class MTWitness32 extends MerkleWitness(32) {}
export const NewMTWitness32 = (wtn: Witness) => new MTWitness32(wtn);
export const EmptyMT32 = () => new MerkleTree(32);

export class MTWitness64 extends MerkleWitness(64) {}
export const NewMTWitness64 = (wtn: Witness) => new MTWitness64(wtn);
export const EmptyMT64 = () => new MerkleTree(64);

export class MTWitness128 extends MerkleWitness(128) {}
export const NewMTWitness128 = (wtn: Witness) => new MTWitness128(wtn);
export const EmptyMT128 = () => new MerkleTree(128);

export class MTWitness255 extends MerkleWitness(255) {}
export const NewMTWitness255 = (wtn: Witness) => new MTWitness255(wtn);
export const EmptyMT255 = () => new MerkleTree(255);

export function getBestHeight(size: bigint) {
    for (const height of SUPPORTED_HEIGHTS) {
        if (size <= BigInt(2 ** (height - 1))) {
            return [
                eval(`MTWitness${height}`),
                eval(`NewMTWitness${height}`),
                eval(`EmptyMT${height}`),
            ];
        }
    }
    throw new Error(`Unsupported tree height: ${size}`);
}
