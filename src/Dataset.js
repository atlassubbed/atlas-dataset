const { isArr } = require("./util")
// XXX this reeks of magic number
const math = [
  require("atlas-stddev"),
  require("atlas-sum"),
  require("atlas-mean-square"),
  require("atlas-median"),
  require("atlas-mad")
]

module.exports = class Dataset {
  constructor(data){
    if (!isArr(data))
      throw new Error("requires array of data points");
    let copy = data.slice(), n = copy.length, cache = {};
    this.size = () => n
    this.add = p => {cache = null; (n = copy.push(p))}
    this.calc = c => {
      // XXX find a less magic way that still avoids if/else
      if (!cache) cache = {};
      if (c in cache) return cache[c];
      if (c < 3) return cache[c] = math[c](copy);
      const m = math[c](copy, cache.sort);
      cache.sort = true;
      return cache[c] = m;
    }
  }
  // XXX don't use magic numbers
  sum(){return this.calc(1)}
  median(){return this.calc(3)}
  mad(){return this.calc(4)}
  mean(){return this.sum()/this.size();}
  stddev(){return math[0](this.mean(), this.calc(2))}
  snapshot(){
    return {
      size: this.size(),
      total: this.sum(),
      mean: this.mean(),
      median: this.median(),
      mad: this.mad(),
      stddev: this.stddev(),
    }
  }
}
