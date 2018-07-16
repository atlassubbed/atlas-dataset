# atlas-dataset

Calculate mean, standard deviation, sum for a set of data points.

[![Travis](https://img.shields.io/travis/atlassubbed/atlas-dataset.svg)](https://travis-ci.org/atlassubbed/atlas-dataset)

---

## install

```
npm install --save atlas-dataset
```

## why

A minimal wrapper, allowing for *basic* statistical inspection of an array of numbers. All linear and polylogarithmic calculations are cached on-demand and reused.

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
console.log(`value: ${set.mean()} +/- ${set.stddev()}`)
console.log(`median: ${set.median()} +/- ${set.mad()}`)
// size: 1000000 sum: 500128.4297823687
// mean: 0.5001284297823687 +/- 0.2884814684388095
// median: 0.4996962409854201 +/- 0.24966274565483493
```

#### updating the data

```javascript
...
set.add(Math.random());
console.log(`size: ${set.size()} sum: ${set.sum()}`)
console.log(`value: ${set.mean()} +/- ${set.stddev()}`)
console.log(`median: ${set.median()} +/- ${set.mad()}`)
// size: 1000001 sum: 500128.76868722256
// mean: 0.500128268558954 +/- 0.2884813692496768
// median: 0.4996961275123013 +/- 0.2496624248162307
```

## caveats

In the examples, `arr` is not normally distributed, nor are we caring about the amount of significant figures in the result.

## todo

For efficiently updating calculations, derive a recurrence relation for each quantity, `V`:

```
V(X_n+1) = f(V(X_n), x_n+1)
```

For example `Mu_n+1 = (Mu_n*n + x_n+1)/(n+1)` and updating the `size` and `sum` is trivial. Recomputing `stddev` is easy using the forumla: `s^2 = <x^2> - <x>^2`. Just square `s_n`, compute `s_n+1^2` then take the square root. Updating the mean square is the exact same thing as updating the mean, we just replace `x_n+1` with `x_n+1^2` in the numerator.
