const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;

  value = null;

  reason = null;

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      // this.onFulfilledCallback && this.onFulfilledCallback(value);
      while (this.onFulfilledCallbacks.length > 0) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      // this.onRejectedCallback && this.onRejectedCallback(reason);
      while (this.onRejectedCallbacks > 0) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };

  // onFulfilledCallback = null;
  // onRejectedCallback = null;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  then = (onFulfilled, onRejected) => {
    const { status } = this;
    if (status === FULFILLED) {
      onFulfilled(this.value);
    } else if (status === REJECTED) {
      onRejected(this.reason);
    } else {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  };
}

const p = new MyPromise((resolve, reject) => {
  // 这里如果使用定时器。那么会直接先走then，进入then方法，状态还是pending，所以不打印任何东西--有问题，看下节
  setTimeout(() => {
    resolve();
    reject();
  }, 500);
});

// 直接把111省略掉了，因为异步任务，第二次then覆盖了第一次then的回调
// 那么可以用一个数组把回调存起来，调用一次删一个
p.then(
  (value) => {
    console.log("resolve-------", 111);
  },
  (reason) => {
    console.log("reject-------", 111);
  }
)

p.then((value) => {
  console.log("resolve-------", 222);
},
(reason) => {
  console.log("reject-------", 222);
})
