function sumToNForLoop(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sumToNRecursion(n) {
  if (n === 1) {
    return 1;
  }
  return n + sumToNRecursion(n - 1);
}

function sumToNArithmetic(n) {
  return (n * (n + 1)) / 2;
}
