import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkSubjctComponent } from './bookmark-subjct.component';

describe('BookmarkSubjctComponent', () => {
  let component: BookmarkSubjctComponent;
  let fixture: ComponentFixture<BookmarkSubjctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarkSubjctComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookmarkSubjctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
