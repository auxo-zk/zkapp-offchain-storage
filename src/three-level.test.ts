import { Field } from 'o1js';
import { ThreeLevelStorage } from './three-level.js';
import { getBestHeight } from './merkle-tree.js';

describe('Three Level Storage', () => {
    const [MTWitnessL1, NewMTWitnessL1, EmptyMTL1] = getBestHeight(8n);
    const [MTWitnessL2, NewMTWitnessL2, EmptyMTL2] = getBestHeight(16n);
    const [MTWitnessL3, NewMTWitnessL3, EmptyMTL3] = getBestHeight(32n);

    class TestStorage extends ThreeLevelStorage<
        Field,
        typeof MTWitnessL1,
        typeof MTWitnessL2,
        typeof MTWitnessL3
    > {
        static readonly height1 = MTWitnessL1.height;
        static readonly height2 = MTWitnessL2.height;
        static readonly height3 = MTWitnessL3.height;

        get height1(): number {
            return TestStorage.height1;
        }

        get height2(): number {
            return TestStorage.height2;
        }

        get height3(): number {
            return TestStorage.height3;
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

        calculateLevel3Index(index: Field): Field {
            return index;
        }
    }

    let testStorage: TestStorage;

    it('Should create new storage', async () => {
        testStorage = new TestStorage(
            EmptyMTL1,
            NewMTWitnessL1,
            EmptyMTL2,
            NewMTWitnessL2,
            EmptyMTL3,
            NewMTWitnessL3
        );
    });

    it('Should update raw leaf', async () => {
        let value = Field(123);
        testStorage.updateRawLeaf(
            {
                level1Index: Field(0),
                level2Index: Field(0),
                level3Index: Field(0),
            },
            value
        );
        let witnesses = testStorage.getWitness(Field(0), Field(0), Field(0));
        expect(
            witnesses.level1
                .calculateRoot(
                    witnesses.level2.calculateRoot(
                        witnesses.level3.calculateRoot(Field(123))
                    )
                )
                .toBigInt()
        ).toEqual(testStorage.root.toBigInt());
    });

    it('Should update leaf', async () => {
        let value = Field(123);
        testStorage.updateRawLeaf(
            {
                level1Index: Field(5),
                level2Index: Field(10),
                level3Index: Field(15),
            },
            value
        );
        let witnesses = testStorage.getWitness(Field(5), Field(10), Field(15));
        expect(
            witnesses.level1
                .calculateRoot(
                    witnesses.level2.calculateRoot(
                        witnesses.level3.calculateRoot(Field(123))
                    )
                )
                .toBigInt()
        ).toEqual(testStorage.root.toBigInt());
    });

    it('Should get public data', async () => {
        testStorage.root,
            testStorage.leafs,
            testStorage.level1,
            testStorage.level2s,
            testStorage.level2(Field(0)),
            testStorage.level3s,
            testStorage.level3(Field(0), Field(0));
        console.log(
            testStorage.height1,
            testStorage.height2,
            testStorage.height3,
            testStorage.size
        );
    });
});
