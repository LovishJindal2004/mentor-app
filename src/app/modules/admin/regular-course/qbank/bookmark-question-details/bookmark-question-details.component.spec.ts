import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkQuestionDetailsComponent } from './bookmark-question-details.component';

describe('BookmarkQuestionDetailsComponent', () => {
  let component: BookmarkQuestionDetailsComponent;
  let fixture: ComponentFixture<BookmarkQuestionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarkQuestionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookmarkQuestionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
