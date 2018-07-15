const { describe, it } = require("mocha")
const { expect } = require("chai")
const rewire = require("rewire")
const Dataset = rewire("../src/Dataset")
const { set } = require("./util")

let revert;

describe("Dataset", function(){

  beforeEach(function(){
    revert && revert();
  })

  const set = [1,2,3,4,5,6,7,8,9,10];
  const sum = set.reduce((p,c)=>p+c,0)
  const mean = set.reduce((p,c)=>p+c,0)/set.length
  const meanSquare = set.reduce((p,c)=>p+c*c,0)/set.length
  const size = set.length;
  const stddev = Math.sqrt(meanSquare - mean*mean)

  it("should throw error if not instantiated with array", function(){
    const invalidSet = [null, undefined, NaN, 2, 4.5, true, {}, () => {}, new Date(), /ddd/, "ddd", Infinity];
    invalidSet.forEach(set => {
      expect(() => new Dataset(set)).to.throw("requires array of data points")
    })
  })
  describe("size", function(){
    it("should return the size of the dataset", function(){
      const d = new Dataset(set);
      expect(d.size()).to.equal(size);
    })
  })
  describe("add", function(){
    it("should add a new point to the dataset", function(){
      const d = new Dataset(set)
      d.add(1);
      expect(d.size()).to.equal(size+1)
    })
  })
  describe("sum", function(){
    it("should return the sum of all points in the dataset", function(){
      const d = new Dataset(set);
      expect(d.sum()).to.equal(sum);
    })
    it("should return a cached result", function(){
      let calledSum = 0;
      revert = Dataset.__set__("sum", inArr => {
        expect(inArr).to.deep.equal(set);
        calledSum++
        return sum;
      })
      const d = new Dataset(set);
      d.sum(), d.mean(), d.stddev();
      expect(d.sum()).to.equal(sum);
      expect(calledSum).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set);
      d.add(1);
      expect(d.sum()).to.equal(sum+1)
    })
  })
  describe("mean", function(){
    it("should return the expectation value of the dataset", function(){
      const d = new Dataset(set);
      expect(d.mean()).to.equal(mean);
    })
    it("should return a cached result", function(){
      let calledSum = 0;
      revert = Dataset.__set__("sum", inArr => {
        expect(inArr).to.deep.equal(set);
        calledSum++
        return sum
      })
      const d = new Dataset(set);
      d.mean(), d.sum(), d.stddev();
      expect(d.mean()).to.equal(mean);
      expect(calledSum).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set), point = 11;
      d.add(point);
      const expectedMean = [point,...set].reduce((p,c)=>p+c,0)/(set.length+1)
      expect(d.mean()).to.equal(expectedMean)
    })
  })
  describe("stddev", function(){
    it("should return the standard deviation of the dataset", function(){
      const d = new Dataset(set);
      expect(d.stddev()).to.equal(stddev);
    })
    it("should return a cached result", function(){
      let calledSum = 0, calledRms2 = 0;
      revert = Dataset.__set__({
        rms2: inArr => {
          calledRms2++;
          return meanSquare
        },
        sum: inArr => {
          calledSum++;
          return sum
        }
      })
      const d = new Dataset(set);
      d.stddev(), d.mean(), d.sum();
      expect(d.stddev()).to.equal(stddev);
      expect(calledRms2).to.equal(1)
      expect(calledSum).to.equal(1)
    })
    it("should properly recompute the result", function(){
      const d = new Dataset(set), point = 11;
      d.add(point);
      const newSet = [point, ...set];
      const expectedMean = newSet.reduce((p,c)=>p+c,0)/newSet.length
      const expectedRms2 = newSet.reduce((p,c)=>p+c*c,0)/newSet.length;
      expect(d.stddev()).to.equal(Math.sqrt(expectedRms2-expectedMean*expectedMean))
    })
  })
})
