import { MerkleTree, MerkleWitness } from 'o1js';
import { Witness } from './base-storage';

export class MTWitness2 extends MerkleWitness(2) {}
export const EmptyMTWitness2 = (wtn: Witness) => new MTWitness2(wtn);
export const EmptyMT2 = () => new MerkleTree(2);

export class MTWitness4 extends MerkleWitness(4) {}
export const EmptyMTWitness4 = (wtn: Witness) => new MTWitness4(wtn);
export const EmptyMT4 = () => new MerkleTree(4);

export class MTWitness6 extends MerkleWitness(6) {}
export const EmptyMTWitness6 = (wtn: Witness) => new MTWitness6(wtn);
export const EmptyMT6 = () => new MerkleTree(6);

export class MTWitness8 extends MerkleWitness(8) {}
export const EmptyMTWitness8 = (wtn: Witness) => new MTWitness8(wtn);
export const EmptyMT8 = () => new MerkleTree(8);

export class MTWitness10 extends MerkleWitness(10) {}
export const EmptyMTWitness10 = (wtn: Witness) => new MTWitness10(wtn);
export const EmptyMT10 = () => new MerkleTree(10);

export class MTWitness16 extends MerkleWitness(16) {}
export const EmptyMTWitness16 = (wtn: Witness) => new MTWitness16(wtn);
export const EmptyMT16 = () => new MerkleTree(16);

export class MTWitness32 extends MerkleWitness(32) {}
export const EmptyMTWitness32 = (wtn: Witness) => new MTWitness32(wtn);
export const EmptyMT32 = () => new MerkleTree(32);

export class MTWitness64 extends MerkleWitness(64) {}
export const EmptyMTWitness64 = (wtn: Witness) => new MTWitness64(wtn);
export const EmptyMT64 = () => new MerkleTree(64);

export class MTWitness128 extends MerkleWitness(128) {}
export const EmptyMTWitness128 = (wtn: Witness) => new MTWitness128(wtn);
export const EmptyMT128 = () => new MerkleTree(128);
