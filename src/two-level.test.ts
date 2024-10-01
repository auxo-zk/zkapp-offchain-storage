import { Field, Provable } from 'o1js';
import { TwoLevelStorage } from './two-level.js';
import {
    EmptyMT4,
    EmptyMT6,
    NewMTWitness4,
    NewMTWitness6,
    MTWitness4,
    MTWitness6,
} from './merkle-tree.js';

class TestStorage extends TwoLevelStorage<Field, MTWitness4, MTWitness6> {
    calculateLeaf(leaf: Field): Field {
        return leaf;
    }

    calculateLevel1Index(index: Field): Field {
        return index;
    }

    calculateLevel2Index(index: Field): Field {
        return index;
    }
}

describe('Two Level Storage', () => {
    let testStorage: TestStorage;

    it('Should create new storage', async () => {
        testStorage = new TestStorage(
            EmptyMT4,
            NewMTWitness4,
            EmptyMT6,
            NewMTWitness6
        );
    });

    it('Should update raw leaf', async () => {
        let value = Field(123);
        testStorage.updateRawLeaf(
            { level1Index: Field(0), level2Index: Field(0) },
            value
        );
        let witnesses = testStorage.getWitness(Field(0), Field(0));
        expect(
            witnesses.level1
                .calculateRoot(witnesses.level2.calculateRoot(Field(123)))
                .toBigInt()
        ).toEqual(testStorage.root.toBigInt());
    });

    it('Should update leaf', async () => {
        let value = Field(123);
        testStorage.updateRawLeaf(
            { level1Index: Field(5), level2Index: Field(10) },
            value
        );
        let witnesses = testStorage.getWitness(Field(5), Field(10));
        expect(
            witnesses.level1
                .calculateRoot(witnesses.level2.calculateRoot(Field(123)))
                .toBigInt()
        ).toEqual(testStorage.root.toBigInt());
    });

    it('Should get public data', async () => {
        Provable.log(
            testStorage.root,
            testStorage.leafs,
            testStorage.level1,
            testStorage.level2s,
            testStorage.level2(Field(0))
        );
    });
});
