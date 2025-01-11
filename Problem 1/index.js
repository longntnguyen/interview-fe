function sumToNForLoop(n) {
  if (n < 0) {
    return 0;
  }
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sumToNRecursion(n) {
  if (n <= 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return n + sumToNRecursion(n - 1);
}

function sumToNArithmetic(n) {
  if (n < 0) {
    return 0;
  }
  return (n * (n + 1)) / 2;
}
