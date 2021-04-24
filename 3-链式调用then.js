// then方法可以链式调用，因此then方法也需要返回一个promise
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
      while (this.onFulfilledCallbacks.length > 0) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      while (this.onRejectedCallbacks > 0) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };

  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  then = (onFulfilled, onRejected) => {
    return new MyPromise((resolve, reject) => {
      const { status } = this;
      if (status === FULFILLED) {
        const x = onFulfilled(this.value);
        // 判断返回值
        resolvePromise(x, resolve, reject);
      } else if (status === REJECTED) {
        const x = onRejected(this.reason);
        // 判断返回值
        resolvePromise(x, resolve, reject);
      } else {
        this.onFulfilledCallbacks.push(() => {
          const x = onFulfilled(this.value);
          resolvePromise(x, resolve, reject);
        });
        this.onRejectedCallbacks.push(() => {
          const x = onRejected(this.reason);
          resolvePromise(x, resolve, reject);
        });
      }
    })
  };
}

const resolvePromise = (x, resolve, reject) => {
  if(x instanceof MyPromise) {
    // 如果返回promise的实例，那么手动调用
    // 这个代码是真的巧妙，把第一个then的返回的promise交给了x来处理
    // 因为x是一个promise，构造器执行一个异步任务，所以会放到执行栈的最后等待，第一个then的返回的promise由于没有执行resolve，所以它的then不会执行
    // 这里把第一个then的返回的promise的构造器中要执行的resolve交给x的then，所以当x的异步任务开始执行时，就会执行第一个then返回的promise的resolve
    // resolve执行执行，它的then也就会跟着执行，太巧妙了
    x.then(resolve, reject);
  } else {
    // 普通值
    resolve(x);
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('第一次的返回值');
    reject();
  }, 500);
});

// 要实现链式调用，那么then的返回值里面需要存在then方法才行
// 需要注意的是：上一个then可能会手动返回一些普通的值。例如123，undefiend等，也可能会手动返回Promise
const p2 = p.then(
  (value) => {
    console.log("resolve-------", value);
    return new MyPromise((resolve, reject) => {
      // setTimeout(() => {
        resolve('第二次');
        reject();
      // }, 500);
    })
  },
  (reason) => {
    console.log("reject-------", 111);
  }
)
// console.log(p2);
.then(
  (value) => {
    console.log("resolve-------", value);
  },
  (reason) => {
    console.log("reject-------", reason);
  }
);
