import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  public page = input.required<number>();
  public totalItems = input.required<number>();
  public pageSize = input<number>(10);
  public disabled = input(false);
  public pageChange = output<number>();
  public totalPages = computed(() => {
    const total = Math.ceil(this.totalItems() / this.pageSize());
    return total > 0 ? total : 1;
  });
  public hasPrevious = computed(() => this.page() > 1);
  public hasNext = computed(() => this.page() < this.totalPages());

  public goToPrevious() {
    if (!this.hasPrevious() || this.disabled()) return;
    this.pageChange.emit(this.page() - 1);
  }

  public goToNext() {
    if (!this.hasNext() || this.disabled()) return;
    this.pageChange.emit(this.page() + 1);
  }

  public goToPage(page: number) {
    if (this.disabled()) return;
    if (page < 1 || page > this.totalPages()) return;
    if (page === this.page()) return;

    this.pageChange.emit(page);
  }

  public visiblePages = computed(() => {
    const current = this.page();
    const total = this.totalPages();

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (current >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }

    return [current - 2, current - 1, current, current + 1, current + 2];
  });
}
