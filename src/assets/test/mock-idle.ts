import { EventEmitter } from '@angular/core';

export const MockIdle = {
    watch: () => { return true; },
    setIdle: () => { return 20 * 60; },
    setInterrupts: () => { },
    onTimeout: new EventEmitter<5>()
};
