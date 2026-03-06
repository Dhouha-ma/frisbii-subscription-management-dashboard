import { Signal, computed } from '@angular/core';

export function paginate<T>(items: Signal<T[]>, page: Signal<number>, pageSize: Signal<number>) {
  return computed(() => {
    const start = (page() - 1) * pageSize();
    const end = start + pageSize();
    return items().slice(start, end);
  });
}
