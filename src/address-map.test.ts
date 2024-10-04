import { Field, Poseidon, PrivateKey, PublicKey } from 'o1js';
import {
    AddressMap as _AddressMap,
    ZkAppRef as _ZkAppRef,
} from './address-map.js';

describe('AddressMap', () => {
    const num_addr = 16;
    const ZkAppRef = _ZkAppRef(num_addr);
    const AddressMap = _AddressMap(num_addr);
    let map: InstanceType<typeof AddressMap>;
    let publicKey: PublicKey;

    beforeAll(() => {
        map = new AddressMap();
    });

    it('should initialize with correct height', () => {
        expect(map.height).toBe(AddressMap.height);
    });

    it('should calculate correct size', () => {
        expect(map.size).toBe(BigInt(2 ** (map.height - 1)));
    });

    it('should calculate leaf correctly', () => {
        publicKey = PrivateKey.random().toPublicKey();
        const leaf = AddressMap.calculateLeaf(publicKey);
        expect(
            leaf.equals(Poseidon.hash(publicKey.toFields())).toBoolean()
        ).toEqual(true);
    });

    it('should calculate index correctly', () => {
        const index = 5;
        const level1Index = AddressMap.calculateIndex(index);
        expect(level1Index.equals(Field(5)).toBoolean()).toEqual(true);
    });

    // it('should update address leaf correctly', () => {
    //     const index = Field(1);
    //     const leaf = AddressMap.calculateLeaf(publicKey);
    //     map.updateAddressLeaf(index, leaf);
    // });

    it('should update address correctly', () => {
        const index = Field(1);
        map.updateAddress(index, publicKey);
    });

    it('should get ZkAppRef correctly', () => {
        const index = 1;
        const zkAppRef: InstanceType<typeof ZkAppRef> = map.getZkAppRef(
            index,
            publicKey
        );
        expect(zkAppRef.address).toEqual(publicKey);
    });

    it('should verify ZkApp correctly', () => {
        const index = 1;
        const zkAppRef = map.getZkAppRef(index, publicKey);
        const root = map.root;
        const key = map.calculateIndex(index);

        expect(() => {
            AddressMap.verifyZkApp('TestProgram', zkAppRef, root, key);
        }).not.toThrow();
    });
});
