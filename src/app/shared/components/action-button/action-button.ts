import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-action-button',
  imports: [],
  templateUrl: './action-button.html',
  styleUrl: './action-button.scss',
})
export class ActionButton {
  public label = input.required<string>();
  public loading = input(false);
  public action = output<void>();

  public handleClick() {
    if (!this.loading()) {
      this.action.emit();
    }
  }
}
