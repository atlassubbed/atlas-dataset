const { isArr, SUM, RMS2 } = require("./util")
const stddev = require("atlas-stddev");
const sum = require("atlas-sum");
const rms2 = require("atlas-mean-square");

module.exports = class Dataset {
  constructor(data){
    if (!isArr(data))
      throw new Error("requires array of data points");
    let copy = data.slice(), n = copy.length, cache = {};
    this.size = () => n
    this.add = p => {cache = {}; (n = copy.push(p))}
    this.calc = c => {
      if (c in cache) return cache[c];
      return (cache[c] = c ? rms2(copy) : sum(copy))
    }
  }
  sum(){
    return this.calc(SUM)
  }
  mean(){
    return this.sum()/this.size();
  }
  stddev(){
    return stddev(this.mean(), this.calc(RMS2))
  }
}
