import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkQuestionListComponent } from './bookmark-question-list.component';

describe('BookmarkQuestionListComponent', () => {
  let component: BookmarkQuestionListComponent;
  let fixture: ComponentFixture<BookmarkQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarkQuestionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookmarkQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
