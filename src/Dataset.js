const { isArr } = require("./util")

module.exports = class Dataset {
  constructor(data){
    if (!isArr(data)) 
      throw new Error("requires array of data points");
    let copy = data.slice(), n = copy.length, cache = {};
    const x = (pow, s=0) => {
      if (pow in cache) return cache[pow];
      if (pow === 1) for (let i=n; i--;) s+= copy[i];
      else for (let i=n, d; i--;) s+= (d=copy[i])*d;
      return (cache[pow] = s)
    }
    this.size = () => n
    this.add = p => {cache = {}; (n = copy.push(p))}
    this.sum = () => x(1)
    this.mean = () => x(1)/n;
    this.stddev = () => {
      const m = x(1)/n
      return Math.sqrt(x(2)/n - m*m)
    }
  }
}
