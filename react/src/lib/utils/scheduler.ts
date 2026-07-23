import EventEmitter from "./eventEmitter";
import { sleep } from "./helpers";

type SchedulerOptions = {
  concurrency?: number;
  retryCount?: number;
  retryDelay?: number;
  stopOnError?: boolean;
  getTaskParams?: (index: number) => any;
};
type SchedulerStatus =
  "idle" | "running" | "pausing" | "paused" | "stopping" | "stopped";

type Task = (signal: AbortSignal, params?: any) => Promise<any>;

type TaskInfo = {
  status: "waiting" | "running" | "interrupted" | "success" | "failed";
  task: Task;
  leftRetryCount: number;
  result?: any;
};

class Scheduler extends EventEmitter {
  #status: SchedulerStatus = "idle";
  #tasks: TaskInfo[] = [];
  #nextTaskIndex = 0;
  #abortControllers: Map<Task, AbortController> = new Map();
  #runningTasks = new Set<number>();
  #pausedTasks: number[] = [];

  constructor(private readonly options: SchedulerOptions) {
    super();
  }

  #noticeFinish() {
    if (this.#runningTasks.size > 0 || this.#status === "stopped") {
      return;
    }
    this.#status = "stopped";
    this.emit(
      "finish",
      this.#tasks.map(({ status, result }) => ({
        success: status === "success",
        result,
      })),
    );
  }

  #noticePause() {
    if (this.#runningTasks.size > 0 || this.#status === "paused") {
      return;
    }
    this.#status = "paused";
    this.emit("paused");
  }

  #forceStop() {
    this.#status = "stopping";
    this.#cancelPendingTasks("stopped");
  }

  #cancelPendingTasks(nextStatus: SchedulerStatus) {
    const entries = [...this.#abortControllers.entries()];
    this.#abortControllers.clear();
    let runningTasksCount = entries.length;
    if (runningTasksCount === 0) {
      this.#status = nextStatus;
      this.emit(nextStatus);
      return;
    }
    const onAbort = () => {
      runningTasksCount--;
      if (runningTasksCount === 0) {
        this.#status = nextStatus;
        this.emit(nextStatus);
      }
    };
    for (const [, controller] of entries) {
      controller.signal.addEventListener("abort", onAbort);
      controller.abort("Scheduler was forcibly stopped.");
    }
  }

  async #handleTask(currentTaskIndex: number) {
    this.#runningTasks.add(currentTaskIndex);
    const currentTask = this.#tasks[currentTaskIndex];
    currentTask.status = "running";
    let result: any;
    let success: boolean | undefined = undefined;
    const params = this.options.getTaskParams?.(currentTaskIndex);
    const abortController = new AbortController();

    do {
      if (success !== undefined && this.options.retryDelay) {
        try {
          await sleep(this.options.retryDelay, abortController.signal);
        } catch {
          // task cancelled, skip retry
          break;
        }
      }
      try {
        this.#abortControllers.set(currentTask.task, abortController);
        result = await currentTask.task(abortController.signal, params);
        success = true;
        break;
      } catch (error) {
        success = false;
        result = error as any;
        currentTask.leftRetryCount--;
      } finally {
        this.#abortControllers.delete(currentTask.task);
      }
    } while (this.#status === "running" && currentTask.leftRetryCount > 0);

    this.#runningTasks.delete(currentTaskIndex);

    if (
      !abortController.signal.aborted &&
      (success || currentTask.leftRetryCount === 0)
    ) {
      // The task is not cancelled
      // and the result is success or run out of retry count
      currentTask.result = result;
      currentTask.status = success ? "success" : "failed";
      this.emit("taskFinish", { success, result }, currentTaskIndex);
    } else {
      // The scheduler is stopped or paused
      currentTask.status = "interrupted";
      if (this.#status === "pausing") {
        this.#pausedTasks.push(currentTaskIndex);
      }
    }
    if (this.#status === "running" && !success && this.options.stopOnError) {
      this.#forceStop();
    }
  }

  async #runNextTask(): Promise<void> {
    if (this.#status === "stopping") {
      this.#noticeFinish();
      return;
    }
    if (this.#status === "pausing") {
      this.#noticePause();
      return;
    }
    if (this.#status !== "running") {
      return;
    }

    let currentTaskIndex: number;
    if (this.#pausedTasks.length) {
      currentTaskIndex = this.#pausedTasks.shift()!;
    } else if (this.#nextTaskIndex < this.#tasks.length) {
      currentTaskIndex = this.#nextTaskIndex++;
    } else {
      this.#noticeFinish();
      return;
    }

    await this.#handleTask(currentTaskIndex);

    return this.#runNextTask();
  }

  /**
   * Reset the scheduler
   */
  clear() {
    if (this.#status === "running") {
      throw new Error("Can not clear running scheduler");
    }
    this.#tasks = [];
    this.#status = "idle";
    this.#nextTaskIndex = 0;
    this.#pausedTasks = [];
    this.#abortControllers.clear();
    this.#runningTasks.clear();
  }

  /**
   * Add new task to scheduler
   * @param task
   */
  addTask(task: Task) {
    if (this.#status !== "idle") {
      throw new Error("Scheduler is not idle, run clear first");
    }
    this.#tasks.push({
      status: "waiting",
      task,
      leftRetryCount: this.options.retryCount ?? 0,
      result: undefined,
    });
  }

  #run() {
    this.#status = "running";
    const concurrency = this.options.concurrency ?? 5;
    while (
      this.#nextTaskIndex < this.#tasks.length &&
      this.#runningTasks.size < concurrency
    ) {
      this.#runNextTask();
    }
  }

  /**
   * Start the scheduler
   */
  start() {
    if (this.#status !== "idle") {
      throw new Error("Scheduler is not idle, run clear first");
    }
    this.#run();
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.#status !== "running") {
      return;
    }
    this.#status = "stopping";
    this.#cancelPendingTasks("stopped");
  }

  restart() {
    if (this.#status !== "paused" && this.#status !== "stopped") {
      throw new Error("Scheduler is not paused or stopped, can not restart");
    }
    this.#tasks = this.#tasks.map(({ task }) => ({
      task,
      status: "waiting",
      leftRetryCount: this.options.retryCount ?? 0,
      result: undefined,
    }));
    this.#status = "idle";
    this.#nextTaskIndex = 0;
    this.#pausedTasks = [];
    this.#abortControllers.clear();
    this.#runningTasks.clear();
    this.start();
  }

  /**
   * Pause the scheduler. If immediate is true, all pending tasks will be cancelled.
   * @param immediate Whether to cancel all pending tasks
   */
  pause(immediate = false) {
    if (this.#status !== "running") {
      return;
    }
    this.#status = "pausing";
    if (immediate) {
      this.#cancelPendingTasks("paused");
    }
  }

  resume() {
    if (this.#status !== "paused") {
      return;
    }
    this.#run();
  }
}

export default Scheduler;
