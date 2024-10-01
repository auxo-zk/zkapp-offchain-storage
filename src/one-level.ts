import { Field, MerkleTree } from 'o1js';
import { BaseStorage, Witness } from './base-storage.js';

export abstract class OneLevelStorage<RawLeaf, MTWitness>
    implements BaseStorage<RawLeaf>
{
    private emptyLevel1Tree: () => MerkleTree;
    private generateLevel1Witness: (witness: Witness) => MTWitness;
    private _level1: MerkleTree;
    private _leafs: {
        [key: string]: { raw: RawLeaf | undefined; leaf: Field };
    };

    constructor(
        emptyLevel1Tree: () => MerkleTree,
        generateLevel1Witness: (witness: Witness) => MTWitness,
        leafs?: {
            level1Index: Field;
            leaf: RawLeaf | Field;
            isRaw: boolean;
        }[]
    ) {
        this.emptyLevel1Tree = emptyLevel1Tree;
        this.generateLevel1Witness = generateLevel1Witness;
        this._level1 = this.emptyLevel1Tree();
        this._leafs = {};
        if (leafs) {
            for (let i = 0; i < leafs.length; i++) {
                let { level1Index, leaf, isRaw } = leafs[i];
                if (isRaw) {
                    this.updateRawLeaf({ level1Index }, leaf as RawLeaf);
                } else {
                    this.updateLeaf({ level1Index }, leaf as Field);
                }
            }
        }
    }

    get root(): Field {
        return this._level1.getRoot();
    }

    get level1(): MerkleTree {
        return this._level1;
    }

    get leafs(): { [key: string]: { raw: RawLeaf | undefined; leaf: Field } } {
        return this._leafs;
    }

    abstract calculateLeaf(args: RawLeaf): Field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract calculateLevel1Index(args: any): Field;

    getLevel1Witness(level1Index: Field): MTWitness {
        return this.generateLevel1Witness(
            this._level1.getWitness(level1Index.toBigInt())
        );
    }

    getWitness(level1Index: Field): MTWitness {
        return this.getLevel1Witness(level1Index);
    }

    updateLeaf({ level1Index }: { level1Index: Field }, leaf: Field) {
        let leafId = level1Index.toString();
        this._level1.setLeaf(level1Index.toBigInt(), leaf);
        this._leafs[leafId] = { raw: undefined, leaf };
    }

    updateRawLeaf({ level1Index }: { level1Index: Field }, rawLeaf: RawLeaf) {
        let leafId = level1Index.toString();
        let leaf = this.calculateLeaf(rawLeaf);
        this._level1.setLeaf(level1Index.toBigInt(), leaf);
        this._leafs[leafId] = { raw: rawLeaf, leaf };
    }
}
