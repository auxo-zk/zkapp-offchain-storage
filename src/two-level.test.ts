import { Field } from 'o1js';
import { TwoLevelStorage } from './two-level.js';
import { getBestHeight } from './merkle-tree.js';

describe('Two Level Storage', () => {
    const [MTWitnessL1, NewMTWitnessL1, EmptyMTL1] = getBestHeight(16n);
    const [MTWitnessL2, NewMTWitnessL2, EmptyMTL2] = getBestHeight(32n);

    class TestStorage extends TwoLevelStorage<
        Field,
        typeof MTWitnessL1,
        typeof MTWitnessL2
    > {
        static readonly height1 = MTWitnessL1.height;
        static readonly height2 = MTWitnessL2.height;

        get height1(): number {
            return TestStorage.height1;
        }

        get height2(): number {
            return TestStorage.height2;
        }

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

    let testStorage: TestStorage;

    it('Should create new storage', async () => {
        testStorage = new TestStorage(
            EmptyMTL1,
            NewMTWitnessL1,
            EmptyMTL2,
            NewMTWitnessL2
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
        testStorage.root,
            testStorage.leafs,
            testStorage.level1,
            testStorage.level2s,
            testStorage.level2(Field(0));
        console.log(testStorage.height1, testStorage.height2, testStorage.size);
    });
});
