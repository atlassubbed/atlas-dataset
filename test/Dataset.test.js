const { describe, it } = require("mocha")
const { expect } = require("chai")
const rewire = require("rewire")
const Dataset = rewire("../src/Dataset")
const { set } = require("./util")
const mean = require("atlas-mean");
const median = require("atlas-median");
const stddev = require("atlas-stddev");
const rms2 = require("atlas-mean-square");
const mad = require("atlas-mad")
const sum = require("atlas-sum")

let revert;

describe("Dataset", function(){

  beforeEach(function(){
    revert && revert();
  })

  const set = [1,2,3,4,5,6,7,8,9,10];

  it("should throw error if not instantiated with array", function(){
    const invalidSet = [null, undefined, NaN, 2, 4.5, true, {}, () => {}, new Date(), /ddd/, "ddd", Infinity];
    invalidSet.forEach(set => {
      expect(() => new Dataset(set)).to.throw("requires array of data points")
    })
  })
  describe("size", function(){
    it("should return the size of the dataset", function(){
      const d = new Dataset(set);
      expect(d.size()).to.equal(set.length);
    })
  })
  describe("add", function(){
    it("should add a new point to the dataset", function(){
      const d = new Dataset(set)
      d.add(1);
      expect(d.size()).to.equal(set.length+1)
    })
  })
  describe("sum", function(){
    it("should return the sum of all points in the dataset", function(){
      const d = new Dataset(set);
      expect(d.sum()).to.equal(sum(set));
    })
    it("should return a cached result", function(){
      let calledSum = 0;
      revert = Dataset.__set__("math[1]", inArr => {
        expect(inArr).to.deep.equal(set);
        calledSum++
        return sum(set);
      })
      const d = new Dataset(set);
      d.sum(), d.mean(), d.stddev();
      expect(d.sum()).to.equal(sum(set));
      expect(calledSum).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set);
      d.add(1);
      expect(d.sum()).to.equal(sum(set)+1)
    })
  })
  describe("mean", function(){
    it("should return the expectation value of the dataset", function(){
      const d = new Dataset(set);
      expect(d.mean()).to.equal(mean(set));
    })
    it("should return a cached result", function(){
      let calledSum = 0;
      revert = Dataset.__set__("math[1]", inArr => {
        expect(inArr).to.deep.equal(set);
        calledSum++
        return sum(set)
      })
      const d = new Dataset(set);
      d.mean(), d.sum(), d.stddev();
      expect(d.mean()).to.equal(mean(set));
      expect(calledSum).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set), point = 11;
      d.add(point);
      expect(d.mean()).to.equal(mean([point, ...set]))
    })
  })
  describe("stddev", function(){
    it("should return the standard deviation of the dataset", function(){
      const d = new Dataset(set);
      expect(d.stddev()).to.equal(stddev(set));
    })
    it("should return a cached result", function(){
      let calledSum = 0, calledRms2 = 0;
      revert = Dataset.__set__({
        "math[2]": inArr => {
          calledRms2++;
          return rms2(set)
        },
        "math[1]": inArr => {
          calledSum++;
          return sum(set)
        }
      })
      const d = new Dataset(set);
      d.stddev(), d.mean(), d.sum();
      expect(d.stddev()).to.equal(stddev(set));
      expect(calledRms2).to.equal(1)
      expect(calledSum).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set), point = 11;
      d.add(point);
      expect(d.stddev()).to.equal(stddev([point, ...set]))
    })
  })
  describe("median", function(){
    it("should return the median of the dataset", function(){
      const d = new Dataset(set);
      expect(d.median()).to.equal(median(set));
    })
    it("should not re-sort the dataset if already sorted", function(){
      let calledMedian = 0
      revert = Dataset.__set__({
        "math[3]": (inArr, isSorted) => {
          calledMedian++;
          expect(isSorted).to.be.true;
          return median(set)
        }
      })
      const d = new Dataset(set);
      d.mad()
      expect(d.median()).to.equal(median(set));
      expect(calledMedian).to.equal(1)
    })
    it("should return a cached result", function(){
      let calledMedian = 0
      revert = Dataset.__set__({
        "math[3]": inArr => {
          calledMedian++
          return median(set)
        }
      })
      const d = new Dataset(set);
      d.median()
      expect(d.median()).to.equal(median(set));
      expect(calledMedian).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set), point = 11;
      d.add(point);
      expect(d.median()).to.equal(median([point, ...set]))
    })
  })
  describe("mad", function(){
    it("should return the median absolute deviation of the dataset", function(){
      const d = new Dataset(set);
      expect(d.mad()).to.equal(mad(set));
    })
    it("should not re-sort the dataset if already sorted", function(){
      let calledMad = 0
      revert = Dataset.__set__({
        "math[4]": (inArr, isSorted) => {
          calledMad++;
          expect(isSorted).to.be.true;
          return mad(set, isSorted)
        }
      })
      const d = new Dataset(set);
      d.median()
      expect(d.mad()).to.equal(mad(set));
      expect(calledMad).to.equal(1)
    })
    it("should return a cached result", function(){
      let calledMad = 0
      revert = Dataset.__set__({
        "math[4]": inArr => {
          calledMad++
          return mad(set)
        }
      })
      const d = new Dataset(set);
      d.mad()
      expect(d.mad()).to.equal(mad(set));
      expect(calledMad).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set), point = 11;
      d.add(point);
      expect(d.mad()).to.equal(mad([point, ...set]))
    })
  })
  describe("snapshot", function(){
    it("should return a snapshot of all the stats", function(){
      const d = new Dataset(set);
      expect(d.snapshot()).to.deep.equal({
        size: set.length,
        total: sum(set),
        mean: mean(set),
        median: median(set),
        stddev: stddev(set),
        mad: mad(set)
      })
    })
  })
})
