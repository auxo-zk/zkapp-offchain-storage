import { Field, Provable } from 'o1js';
import { OneLevelStorage } from './one-level.js';
import { EmptyMT4, EmptyMTWitness4, MTWitness4 } from './merkle-tree.js';

class TestStorage extends OneLevelStorage<Field, MTWitness4> {
    calculateLeaf(leaf: Field): Field {
        return leaf;
    }

    calculateLevel1Index(index: Field): Field {
        return index;
    }
}

describe('Single Level Storage', () => {
    let testStorage: TestStorage;

    it('Should create new storage', async () => {
        testStorage = new TestStorage(EmptyMT4, EmptyMTWitness4);
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

    it('Should get public data', async () => {
        Provable.log(testStorage.root, testStorage.leafs, testStorage.level1);
    });

    // it('Should manage 2-level MT', async () => {
    //     let publicKey = PrivateKey.random().toPublicKey();
    //     publicKeyStorage.updateRawLeaf(
    //         { level1Index: Field(1), level2Index: Field(2) },
    //         publicKey.toGroup()
    //     );
    //     let witnesses = publicKeyStorage.getWitness(Field(1), Field(2));
    //     expect(
    //         witnesses.level2
    //             .calculateRoot(
    //                 PublicKeyStorage.calculateLeaf(publicKey.toGroup())
    //             )
    //             .toBigInt()
    //     ).toEqual(
    //         publicKeyStorage.level2s[Field(1).toString()].getRoot().toBigInt()
    //     );
    //     expect(
    //         witnesses.level1
    //             .calculateRoot(
    //                 publicKeyStorage.level2s[Field(1).toString()].getRoot()
    //             )
    //             .toBigInt()
    //     ).toEqual(publicKeyStorage.root.toBigInt());
    // });
});
