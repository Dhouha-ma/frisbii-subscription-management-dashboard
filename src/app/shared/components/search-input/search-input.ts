import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  imports: [],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  public placeholder = input('');
  public onInput = output<string>();

  public onSearch(inputValue: string) {
    this.onInput.emit(inputValue);
  }
}
