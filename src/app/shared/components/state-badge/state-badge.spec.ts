import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateBadge } from './state-badge';

describe('StateBadge', () => {
  let component: StateBadge;
  let fixture: ComponentFixture<StateBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
