What is the Node.js Event Loop?
   - The Node.js Event Loop is the core mechanism that allows Node.js to handle many operations at the same time using a single thread.
    It’s what makes Node.js non-blocking and asynchronous.


What is Libuv and What Role Does It Play in Node.js?
  - ibuv is the low-level C library that gives Node.js its event loop, thread pool, and non-blocking asynchronous I/O capabilities.


How Does Node.js Handle Asynchronous Operations Under the Hood?
  - Node.js handles asynchronous operations by offloading them to libuv, which either uses OS-level async APIs or a thread pool. When the operation completes,
     Its callback is queued and executed by the event loop when the call stack becomes free.


What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
  - The Call Stack executes JavaScript code, the Event Queue stores completed async callbacks, and the Event Loop continuously moves callbacks from the queue to the stack when it’s empty.


What is the Node.js Thread Pool and How to Set the Thread Pool Size? 
  - The Node.js thread pool is part of libuv and is used to execute blocking operations like file system, crypto, and compression tasks in the background.
    Its default size is 4 threads and can be configured using the UV_THREADPOOL_SIZE environment variable before the application starts.


How Does Node.js Handle Blocking and Non-Blocking Code Execution?
  - How Does Node.js Handle Blocking and Non-Blocking Code Execution?
