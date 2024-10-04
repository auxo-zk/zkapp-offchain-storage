import { Field } from 'o1js';
import { KeyValueStorage } from './key-value.js';

class TestStorage extends KeyValueStorage<Field> {
    calculateLeaf(leaf: Field): Field {
        return leaf;
    }

    calculateKey(index: Field): Field {
        return index;
    }
}

describe('Key Value Storage', () => {
    let testStorage: TestStorage;

    it('Should create new storage', async () => {
        testStorage = new TestStorage();
    });

    it('Should update raw value', async () => {
        let value = Field(123);
        testStorage.updateRawValue(Field(0), value);
        let witness = testStorage.getWitness(Field(0));
        expect(witness.calculateRoot(value).toBigInt()).toEqual(
            testStorage.root.toBigInt()
        );
    });

    it('Should update value', async () => {
        let value = Field(123);
        testStorage.updateValue(Field(1), value);
        let witness = testStorage.getWitness(Field(1));
        expect(witness.calculateRoot(value).toBigInt()).toEqual(
            testStorage.root.toBigInt()
        );
    });

    it('Should get public data', async () => {
        testStorage.root,
            testStorage.mapping,
            testStorage.values,
            testStorage.height,
            testStorage.size;
    });
});
