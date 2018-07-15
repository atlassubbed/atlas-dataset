# atlas-dataset

Calculate mean, standard deviation, sum for a set of data points.

[![Travis](https://img.shields.io/travis/atlassubbed/atlas-dataset.svg)](https://travis-ci.org/atlassubbed/atlas-dataset)

---

## install

```
npm install --save atlas-dataset
```

## why

A minimal wrapper, allowing for *basic* statistical inspection of an array of numbers. All linear-time calculations are cached on-demand and reused.

## examples

#### instantiate a new `Dataset`

For these examples, we'll be using an array of 1,000,000 random floats between zero and one. When you instantiate a new `Dataset`, the array is shallow copied to avoid manipulating the original:

```javascript
const Dataset = require("atlas-dataset");
const arr = [];
for (let i = 1e6; i--;){
  arr.push(Math.random())
}
const set = new Dataset(arr)
```

#### calculate values

```javascript
...
console.log(`size: ${set.size()} sum: ${set.sum()}`)
// size: 1000000 sum: 500625.8073510996
console.log(`value: ${set.mean()} +/- ${set.stddev()}`)
// value: 0.5006258073510996 +/- 0.2889362460034084
```

#### updating the data

```javascript
...
set.add(Math.random());
console.log(`size: ${set.size()} sum: ${set.sum()}`)
// size: 1000001 sum: 500626.3141132523
console.log(`value: ${set.mean()} +/- ${set.stddev()}`)
// value: 0.5006258134874387 +/- 0.28893610160055483
```

## caveats

In the examples, `arr` is not normally distributed, nor are we caring about the amount of significant figures in the result.
