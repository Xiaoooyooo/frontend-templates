type EventHandler = {
  (...data: any[]): void;
  orginHandler?: (...data: any[]) => void;
};

export default class EventEmitter {
  #events = new Map<string, EventHandler[]>();

  on(event: string, handler: (...data: any[]) => void) {
    const handlers = this.#events.get(event) ?? [];
    handlers.push(handler);
    this.#events.set(event, handlers);
  }

  emit(event: string, ...data: any[]) {
    const handlers = this.#events.get(event);
    if (!handlers) {
      return;
    }
    [...handlers].forEach((handler) => handler(...data));
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.#events.get(event);
    if (!handlers) {
      return;
    }
    const index = handlers.findIndex((h) => {
      return h === handler || h.orginHandler === handler;
    });
    if (index === -1) {
      return;
    }
    handlers.splice(index, 1);
    if (handlers.length === 0) {
      this.#events.delete(event);
    }
  }

  removeAllListeners(event: string) {
    this.#events.delete(event);
  }

  once(event: string, handler: EventHandler) {
    const onceHandler: EventHandler = (...data: any[]) => {
      handler(...data);
      this.off(event, onceHandler);
    };
    onceHandler.orginHandler = handler;
    this.on(event, onceHandler);
  }
}
