// Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
// Promise 会有三种状态
// Pending 等待
// Fulfilled 完成
// Rejected 失败
// 状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
// Promise 中使用 resolve 和 reject 两个函数来更改状态；
// then 方法内部做但事情就是状态判断
// 如果状态是成功，调用成功回调函数
// 如果状态是失败，调用失败回调函数
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  // new的时候回传入一个函数
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  // 当前状态
  status = PENDING;

  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      this.onFulfilledCallback && this.onFulfilledCallback(value);
    }
  };

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      this.onRejectedCallback && this.onRejectedCallback(reason);
    }
  };

  onFulfilledCallback = null;
  onRejectedCallback = null;

  // then关键字
  then = (onFulfilled, onRejected) => {
    const { status } = this;
    if (status === FULFILLED) {
      onFulfilled(this.value);
    } else if (status === REJECTED) {
      onRejected(this.reason);
    } else {
      // pending状态--由于可能存在异步任务，我们要先把onFulfilled和存起来，如果状态改变就直接调用
      this.onFulfilledCallback = onFulfilled;
      this.onRejectedCallback = onRejected;
    }
  };
}

const p = new MyPromise((resolve, reject) => {
  // 这里如果使用定时器。那么会直接先走then，进入then方法，状态还是pending，所以不打印任何东西--有问题，看下节
  setTimeout(() => {
    resolve();
    reject();
  }, 0);
  // resolve("成功");
  // reject("失败");
});

p.then(
  (value) => {
    console.log("resolve-------", value); // 成功之后就不会再执行失败了
  },
  (reason) => {
    console.log("reject-------", reason);
  }
);
