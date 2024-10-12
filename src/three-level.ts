import { Field, MerkleTree } from 'o1js';
import { BaseStorage, Witness } from './base-storage.js';

export abstract class ThreeLevelStorage<
    RawLeaf,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MTWitnessLevel1 extends abstract new (...args: any) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MTWitnessLevel2 extends abstract new (...args: any) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MTWitnessLevel3 extends abstract new (...args: any) => any
> implements BaseStorage<RawLeaf>
{
    public emptyLevel1Tree: () => MerkleTree;
    public generateLevel1Witness: (
        witness: Witness
    ) => InstanceType<MTWitnessLevel1>;
    public emptyLevel2Tree: () => MerkleTree;
    public generateLevel2Witness: (
        witness: Witness
    ) => InstanceType<MTWitnessLevel2>;
    public emptyLevel3Tree: () => MerkleTree;
    public generateLevel3Witness: (
        witness: Witness
    ) => InstanceType<MTWitnessLevel3>;
    public _level1: MerkleTree;
    public _level2s: { [key: string]: MerkleTree };
    public _level3s: { [key: string]: MerkleTree };
    public _leafs: {
        [key: string]: { raw: RawLeaf | undefined; leaf: Field };
    };

    constructor(
        emptyLevel1Tree: () => MerkleTree,
        generateLevel1Witness: (
            witness: Witness
        ) => InstanceType<MTWitnessLevel1>,
        emptyLevel2Tree: () => MerkleTree,
        generateLevel2Witness: (
            witness: Witness
        ) => InstanceType<MTWitnessLevel2>,
        emptyLevel3Tree: () => MerkleTree,
        generateLevel3Witness: (
            witness: Witness
        ) => InstanceType<MTWitnessLevel3>,
        leafs?: {
            level1Index: Field;
            level2Index: Field;
            level3Index: Field;
            leaf: RawLeaf | Field;
            isRaw: boolean;
        }[]
    ) {
        this.emptyLevel1Tree = emptyLevel1Tree;
        this.generateLevel1Witness = generateLevel1Witness;
        this.emptyLevel2Tree = emptyLevel2Tree;
        this.generateLevel2Witness = generateLevel2Witness;
        this.emptyLevel3Tree = emptyLevel3Tree;
        this.generateLevel3Witness = generateLevel3Witness;
        this._level1 = this.emptyLevel1Tree();
        this._level2s = {};
        this._level3s = {};
        this._leafs = {};
        if (leafs) {
            for (let i = 0; i < leafs.length; i++) {
                let { level1Index, level2Index, level3Index, leaf, isRaw } =
                    leafs[i];
                if (isRaw) {
                    this.updateRawLeaf(
                        { level1Index, level2Index, level3Index },
                        leaf as RawLeaf
                    );
                } else {
                    this.updateLeaf(
                        { level1Index, level2Index, level3Index },
                        leaf as Field
                    );
                }
            }
        }
    }

    abstract get height1(): number;
    abstract get height2(): number;
    abstract get height3(): number;

    get size(): bigint {
        return BigInt(2 ** (this.height1 + this.height2 + this.height3 - 3));
    }

    get root(): Field {
        return this._level1.getRoot();
    }

    get level1(): MerkleTree {
        return this._level1;
    }

    get level2s(): { [key: string]: MerkleTree } {
        return this._level2s;
    }

    level2(level1Index: Field): MerkleTree {
        return this.level2s[level1Index.toString()];
    }

    get level3s(): { [key: string]: MerkleTree } {
        return this._level3s;
    }

    level3(level1Index: Field, level2Index: Field): MerkleTree {
        return this.level3s[
            level1Index.toString() + '-' + level2Index.toString()
        ];
    }

    get leafs(): { [key: string]: { raw: RawLeaf | undefined; leaf: Field } } {
        return this._leafs;
    }

    abstract calculateLeaf(args: RawLeaf): Field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract calculateLevel1Index(args: any): Field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract calculateLevel2Index(args: any): Field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract calculateLevel3Index(args: any): Field;

    getLevel1Witness(level1Index: Field): InstanceType<MTWitnessLevel1> {
        return this.generateLevel1Witness(
            this._level1.getWitness(level1Index.toBigInt())
        );
    }

    getLevel2Witness(
        level1Index: Field,
        level2Index: Field
    ): InstanceType<MTWitnessLevel2> {
        let level2 = this.level2(level1Index);
        if (level2 === undefined)
            throw new Error('Level 2 MT does not exist at this index');
        return this.generateLevel2Witness(
            level2.getWitness(level2Index.toBigInt())
        );
    }

    getLevel3Witness(
        level1Index: Field,
        level2Index: Field,
        level3Index: Field
    ): InstanceType<MTWitnessLevel3> {
        let level3 = this.level3(level1Index, level2Index);
        if (level3 === undefined)
            throw new Error('Level 3 MT does not exist at this index');
        return this.generateLevel3Witness(
            level3.getWitness(level3Index.toBigInt())
        );
    }

    getWitness(
        level1Index: Field,
        level2Index: Field,
        level3Index: Field
    ): {
        level1: InstanceType<MTWitnessLevel1>;
        level2: InstanceType<MTWitnessLevel2>;
        level3: InstanceType<MTWitnessLevel3>;
    } {
        return {
            level1: this.getLevel1Witness(level1Index),
            level2: this.getLevel2Witness(level1Index, level2Index),
            level3: this.getLevel3Witness(
                level1Index,
                level2Index,
                level3Index
            ),
        };
    }

    updateInternalLevel1(level1Index: Field, level2: MerkleTree) {
        this._level2s[level1Index.toString()] = level2;
        this._level1.setLeaf(level1Index.toBigInt(), level2.getRoot());
    }

    updateInternalLevel2(
        level1Index: Field,
        level2Index: Field,
        level3: MerkleTree
    ) {
        this._level3s[level1Index.toString() + '-' + level2Index.toString()] =
            level3;
        let level2 = this._level2s[level1Index.toString()];
        if (level2 === undefined) level2 = this.emptyLevel2Tree();
        level2.setLeaf(level2Index.toBigInt(), level3.getRoot());
        this._level2s[level1Index.toString()] = level2;
        this._level1.setLeaf(level1Index.toBigInt(), level2.getRoot());
    }

    updateLeaf(
        {
            level1Index,
            level2Index,
            level3Index,
        }: { level1Index: Field; level2Index: Field; level3Index: Field },
        leaf: Field
    ) {
        let leafId =
            level1Index.toString() +
            '-' +
            level2Index.toString() +
            '-' +
            level3Index.toString();
        let level3 =
            this._level3s[
                level1Index.toString() + '-' + level2Index.toString()
            ];
        if (level3 === undefined) level3 = this.emptyLevel3Tree();
        level3.setLeaf(level3Index.toBigInt(), leaf);
        this.updateInternalLevel2(level1Index, level2Index, level3);
        this._leafs[leafId] = { raw: undefined, leaf };
    }

    updateRawLeaf(
        {
            level1Index,
            level2Index,
            level3Index,
        }: { level1Index: Field; level2Index: Field; level3Index: Field },
        rawLeaf: RawLeaf
    ) {
        let leaf = this.calculateLeaf(rawLeaf);
        let leafId =
            level1Index.toString() +
            '-' +
            level2Index.toString() +
            '-' +
            level3Index.toString();
        let level3 =
            this._level3s[
                level1Index.toString() + '-' + level2Index.toString()
            ];
        if (level3 === undefined) level3 = this.emptyLevel3Tree();
        level3.setLeaf(level3Index.toBigInt(), leaf);
        this.updateInternalLevel2(level1Index, level2Index, level3);
        this._leafs[leafId] = { raw: rawLeaf, leaf };
    }
}
