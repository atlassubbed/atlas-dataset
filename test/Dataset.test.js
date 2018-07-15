const { describe, it } = require("mocha")
const { expect } = require("chai")
const Dataset = require("../src/Dataset")
const { set } = require("./util")

describe("Dataset", function(){
  it("should throw error if not instantiated with array", function(){
    const invalidSet = [null, undefined, NaN, 2, 4.5, true, {}, () => {}, new Date(), /ddd/, "ddd", Infinity];
    invalidSet.forEach(set => {
      expect(() => new Dataset(set)).to.throw("requires array of data points")
    })
  })
  describe("sum", function(){
    it("should return the sum of all points in the dataset", function(){
      const s = set(), d = new Dataset(s);
      expect(d.sum()).to.equal(s.reduce((p,c)=>p+c,0));
    })
  })
  describe("mean", function(){
    it("should return the expectation value of the dataset", function(){
      const s = set(), d = new Dataset(s);
      expect(d.mean()).to.equal(s.reduce((p,c)=>p+c,0)/s.length);
    })
  })
  describe("stddev", function(){
    it("should return the standard deviation of the dataset", function(){
      const s = set(), d = new Dataset(s);
      const mean = s.reduce((p,c)=>p+c,0)/s.length
      const meanSquare = s.reduce((p,c)=>p+c*c,0)/s.length
      expect(d.stddev()).to.equal(Math.sqrt(meanSquare - mean*mean));
    })
  })
  describe("size", function(){
    it("should return the size of the dataset", function(){
      const s = set(), d = new Dataset(s);
      expect(d.size()).to.equal(s.length);
    })
  })
  describe("add", function(){
    it("should add a new point to the dataset", function(){
      const s = set(), d = new Dataset(s), p = 11;
      d.add(p);
      expect(d.sum()).to.equal(s.reduce((p,c) => p+c,0)+p)
    })
    it("should update the size of the dataset", function(){
      const s = set(), d = new Dataset(s), p = 11;
      d.add(p);
      expect(d.size()).to.equal(s.length + 1)
    })
  })
})
