import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('page', 2);
    fixture.componentRef.setInput('totalItems', 30);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('disabled', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages', () => {
    expect(component.totalPages()).toBe(3);
  });

  it('should emit previous page', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.goToPrevious();

    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should emit next page', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.goToNext();

    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should emit selected page', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.goToPage(3);

    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should return visible pages', () => {
    expect(component.visiblePages()).toEqual([1, 2, 3]);
  });
});
