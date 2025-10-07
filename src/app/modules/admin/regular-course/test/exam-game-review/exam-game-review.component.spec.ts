import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamGameReviewComponent } from './exam-game-review.component';

describe('ExamGameReviewComponent', () => {
  let component: ExamGameReviewComponent;
  let fixture: ComponentFixture<ExamGameReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamGameReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamGameReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
