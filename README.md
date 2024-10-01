# Auxo Libs

<p align="center">
    <a href="http://auxo.fund/" target="blank"><img src="https://lh3.googleusercontent.com/u/0/drive-viewer/AKGpihbOeavm7ejNaJLr70jxI0YLtj_KzKk7pzjyfbrBPxKRCmXIhEmhLftyPX_ZgOTdpE_B9uoPmiyP1NhBTIShqW8rtQhusA=w2388-h1376" alt="Auxo Logo" /></a>
</p>

<p align="center">
An On-chain Funding Platform with privacy-preserving features powered by ZKP.
</p>
<p align="center">
    <a href="https://www.npmjs.com/org/auxo-dev" target="_blank"><img src="https://img.shields.io/npm/v/@auxo-dev/auxo-libs.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/org/auxo-dev" target="_blank"><img src="https://img.shields.io/npm/l/@auxo-dev/auxo-libs.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/org/auxo-dev" target="_blank"><img src="https://img.shields.io/npm/dm/@auxo-dev/auxo-libs.svg" alt="NPM Downloads" /></a>
    <a href='https://coveralls.io/github/auxo-zk/auxo-libs?branch=main'><img src='https://coveralls.io/repos/github/auxo-zk/auxo-libs/badge.svg?branch=main' alt='Coverage Status' /></a>
    <a href="https://twitter.com/AuxoZk" target="_blank"><img src="https://img.shields.io/twitter/follow/AuxoZk.svg?style=social&label=Follow"></a>
</p>

## Description

This library provides offchain storage APIs for Mina's zkApp, wrap around the Merkle Tree data structure.

To implement these APIs, developers need to:

-   Specify the storage's size - Merkle Trees' height (except for key-value storage)
-   Define data structure for a record and how to commit them in a single Field value (254-bit).
-   How to calculate an index value.

## Features

1. **OneLevelStorage**: Abstract class for a simple storage with predefined size of record.

2. **TwoLevelStorage**: Abstract class for a nested storage (two level of MT) with predefined size of record.

3. **KeyValueStorage**: Abstract class for a key value storage with 254-bit of key's length.

## How to build

```sh
npm run build
```

## How to run tests

```sh
npm run test
npm run testw # watch mode
```

## How to run coverage

```sh
npm run coverage
```

## License

[Apache-2.0](LICENSE)
