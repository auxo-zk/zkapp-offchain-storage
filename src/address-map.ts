import { Field, MerkleTree, Poseidon, PublicKey, Struct } from 'o1js';
import { Utils } from '@auxo-dev/auxo-libs';
import { Witness } from './base-storage.js';
import { getBestHeight } from './merkle-tree.js';
import { OneLevelStorage } from './one-level.js';

export { AddressMap, ZkAppRef };

const ZkAppRef = (num_addr: number) => {
    const [MTWitness, ,] = getBestHeight(BigInt(num_addr));
    return class _ZkAppRef extends Struct({
        address: PublicKey,
        witness: MTWitness,
    }) {};
};

const AddressMap = (num_addr: number) => {
    const [MTWitness, NewMTWitness, EmptyMT] = getBestHeight(BigInt(num_addr));
    class _ZkAppRef extends ZkAppRef(num_addr) {}

    return class _AddressMap extends OneLevelStorage<
        PublicKey,
        typeof MTWitness
    > {
        public override generateLevel1Witness: (
            witness: Witness
        ) => InstanceType<typeof MTWitness>;
        public _level1: MerkleTree;
        public _leafs: {
            [key: string]: { raw: PublicKey | undefined; leaf: Field };
        };

        constructor(
            leafs?: {
                level1Index: Field;
                leaf: PublicKey | Field;
                isRaw: boolean;
            }[]
        ) {
            super(EmptyMT, NewMTWitness, leafs);
        }

        static readonly height = MTWitness.height;

        get height(): number {
            return _AddressMap.height;
        }

        get size(): bigint {
            return BigInt(2 ** (this.height - 1));
        }

        get addressMap(): MerkleTree {
            return this.level1;
        }

        get addresses(): {
            [key: string]: { raw: PublicKey | undefined; leaf: Field };
        } {
            return this.leafs;
        }

        static calculateLeaf(address: PublicKey): Field {
            return Poseidon.hash(address.toFields());
        }

        calculateLeaf(address: PublicKey): Field {
            return _AddressMap.calculateLeaf(address);
        }

        static calculateLevel1Index(index: number): Field {
            return Field(index);
        }

        calculateLevel1Index(index: number): Field {
            return _AddressMap.calculateLevel1Index(index);
        }

        static calculateIndex(index: number): Field {
            return _AddressMap.calculateLevel1Index(index);
        }

        calculateIndex(index: number): Field {
            return _AddressMap.calculateIndex(index);
        }

        getWitness(index: Field): InstanceType<typeof MTWitness> {
            return super.getWitness(index);
        }

        updateAddressLeaf(index: Field, leaf: Field): void {
            super.updateLeaf({ level1Index: index }, leaf);
        }

        updateAddress(index: Field, address: PublicKey) {
            super.updateRawLeaf({ level1Index: index }, address);
        }

        getZkAppRef(index: number, address: PublicKey): _ZkAppRef {
            let witness = this.getWitness(this.calculateIndex(index));
            return new _ZkAppRef({ address, witness });
        }

        /**
         * Verify the address of a zkApp
         * @param programName Name of SC/ZKPr
         * @param ref Reference to a zkApp
         * @param key Index of its address in MT
         */
        static verifyZkApp(
            programName: string,
            ref: _ZkAppRef,
            root: Field,
            key: Field
        ) {
            root.assertEquals(
                ref.witness.calculateRoot(
                    Poseidon.hash(ref.address.toFields())
                ),
                Utils.buildAssertMessage(
                    programName,
                    'verifyZkApp',
                    'Incorrect mapping root'
                )
            );

            key.assertEquals(
                ref.witness.calculateIndex(),
                Utils.buildAssertMessage(
                    programName,
                    'verifyZkApp',
                    'Incorrect address index'
                )
            );
        }
    };
};
