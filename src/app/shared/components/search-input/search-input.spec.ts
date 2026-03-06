import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInput } from './search-input';

describe('SearchInput', () => {
  let component: SearchInput;
  let fixture: ComponentFixture<SearchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should emit input value', () => {
      const emitSpy = vi.spyOn(component.onInput, 'emit');

      component.onSearch('john');

      expect(emitSpy).toHaveBeenCalledWith('john');
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit empty string when input is empty', () => {
      const emitSpy = vi.spyOn(component.onInput, 'emit');

      component.onSearch('');

      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });
});
