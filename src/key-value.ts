import { Field, MerkleTree } from 'o1js';
import { BaseStorage } from './base-storage.js';
import { EmptyMT254, MTWitness254 } from './merkle-tree.js';

export abstract class KeyValueStorage<RawValue>
    implements BaseStorage<RawValue>
{
    private _mapping: MerkleTree;
    private _leafs: {
        [key: string]: { raw: RawValue | undefined; leaf: Field };
    };

    constructor(
        leafs?: {
            key: Field;
            value: RawValue | Field;
            isRaw: boolean;
        }[]
    ) {
        this._mapping = EmptyMT254();
        this._leafs = {};
        if (leafs) {
            for (let i = 0; i < leafs.length; i++) {
                let { key, value, isRaw } = leafs[i];
                if (isRaw) {
                    this.updateRawValue(key, value as RawValue);
                } else {
                    this.updateValue(key, value as Field);
                }
            }
        }
    }

    get root(): Field {
        return this._mapping.getRoot();
    }

    get leafs(): { [key: string]: { raw: RawValue | undefined; leaf: Field } } {
        return this._leafs;
    }

    get mapping(): MerkleTree {
        return this._mapping;
    }

    get values(): {
        [key: string]: { raw: RawValue | undefined; leaf: Field };
    } {
        return this.leafs;
    }

    abstract calculateLeaf(args: RawValue): Field;
    calculateValue(args: RawValue): Field {
        return this.calculateLeaf(args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract calculateKey(args: any): Field;

    getWitness(key: Field): MTWitness254 {
        return new MTWitness254(this._mapping.getWitness(key.toBigInt()));
    }

    updateLeaf({ index }: { index: Field }, leaf: Field) {
        let leafId = index.toString();
        this._mapping.setLeaf(index.toBigInt(), leaf);
        this._leafs[leafId] = { raw: undefined, leaf };
    }

    updateValue(index: Field, leaf: Field) {
        this.updateLeaf({ index }, leaf);
    }

    updateRawLeaf({ index }: { index: Field }, rawLeaf: RawValue) {
        let leaf = this.calculateLeaf(rawLeaf);
        this.updateLeaf({ index }, leaf);
        this._leafs[index.toString()] = { raw: rawLeaf, leaf };
    }

    updateRawValue(key: Field, rawValue: RawValue) {
        this.updateRawLeaf({ index: key }, rawValue);
    }
}
