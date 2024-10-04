import { Field } from 'o1js';
import { OneLevelStorage } from './one-level.js';
import { getBestHeight } from './merkle-tree.js';

describe('Single Level Storage', () => {
    const size = BigInt(2 ** 3);
    const [MTWitness, NewMTWitness, EmptyMT] = getBestHeight(size);
    class TestStorage extends OneLevelStorage<Field, typeof MTWitness> {
        static readonly height = MTWitness.height;

        get height(): number {
            return TestStorage.height;
        }

        calculateLeaf(leaf: Field): Field {
            return leaf;
        }

        calculateLevel1Index(index: Field): Field {
            return index;
        }
    }

    let testStorage: TestStorage;

    it('Should return correct setup for height', () => {
        expect(MTWitness).toBeDefined();
        expect(NewMTWitness).toBeDefined();
        expect(EmptyMT).toBeDefined();
        expect(MTWitness.empty()).toBeInstanceOf(MTWitness);
        expect(NewMTWitness).toBeInstanceOf(Function);
        expect(EmptyMT).toBeInstanceOf(Function);
    });

    it('Should create new storage', async () => {
        testStorage = new TestStorage(EmptyMT, NewMTWitness);
    });

    it('Should update raw leaf', async () => {
        let value = Field(123);
        testStorage.updateRawLeaf({ level1Index: Field(0) }, value);
        let witness = testStorage.getWitness(Field(0));
        expect(witness.calculateRoot(value).toBigInt()).toEqual(
            testStorage.root.toBigInt()
        );
    });

    it('Should update leaf', async () => {
        let value = Field(123);
        testStorage.updateLeaf({ level1Index: Field(1) }, value);
        let witness = testStorage.getWitness(Field(1));
        expect(witness.calculateRoot(value).toBigInt()).toEqual(
            testStorage.root.toBigInt()
        );
    });

    it('Should have correct size', async () => {
        for (let i = 0; i < Number(size); i++) {
            testStorage.updateLeaf({ level1Index: Field(i) }, Field(i));
        }
        expect(() =>
            testStorage.updateLeaf({ level1Index: Field(size) }, Field(size))
        ).toThrowError();
    });

    it('Should get public data', async () => {
        testStorage.root,
            testStorage.leafs,
            testStorage.level1,
            testStorage.height,
            testStorage.size;
    });
});
