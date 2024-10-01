import { Bool, Field } from 'o1js';

export { BaseStorage, BaseMerkleWitness, Witness };

type Witness = {
    isLeft: boolean;
    sibling: Field;
}[];

interface BaseMerkleWitness {
    path: Field[];
    isLeft: Bool[];
    height(): number;
    calculateRoot(leaf: Field): Field;
    calculateIndex(): Field;
}

type Index = {
    [key: string]: Field;
};

interface BaseStorage<RawLeaf> {
    get root(): Field;
    get leafs(): { [key: string]: { raw: RawLeaf | undefined; leaf: Field } };
    calculateLeaf(args: RawLeaf): Field;
    updateLeaf(index: Index, leaf: Field): void;
    updateRawLeaf(index: Index, rawLeaf: RawLeaf): void;
}
