import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-state-badge',
  imports: [],
  templateUrl: './state-badge.html',
  styleUrl: './state-badge.scss',
})
export class StateBadge {
  public state = input<string | undefined>();
  public availableState = computed(() => {
    const value = (this.state() ?? '').toLowerCase();

    const allowed = [
      'created',
      'pending',
      'settled',
      'authorized',
      'failed',
      'active',
      'cancelled',
      'expired',
      'on_hold',
    ];

    return allowed.includes(value) ? value : 'unknown';
  });
}
