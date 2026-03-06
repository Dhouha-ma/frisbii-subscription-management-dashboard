import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButton } from './action-button';

describe('ActionButton', () => {
  let component: ActionButton;
  let fixture: ComponentFixture<ActionButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionButton);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Test');

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleClick', () => {
    it('should emit action when not loading', () => {
      const emitSpy = vi.spyOn(component.action, 'emit');

      fixture.componentRef.setInput('loading', false);

      component.handleClick();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit action when loading is true', () => {
      const emitSpy = vi.spyOn(component.action, 'emit');

      fixture.componentRef.setInput('loading', true);

      component.handleClick();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
