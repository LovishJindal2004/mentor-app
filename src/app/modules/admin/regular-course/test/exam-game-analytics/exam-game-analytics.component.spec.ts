import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamGameAnalyticsComponent } from './exam-game-analytics.component';

describe('ExamGameAnalyticsComponent', () => {
  let component: ExamGameAnalyticsComponent;
  let fixture: ComponentFixture<ExamGameAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamGameAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamGameAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
