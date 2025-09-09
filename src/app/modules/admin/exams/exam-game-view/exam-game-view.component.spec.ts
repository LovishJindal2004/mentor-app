import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamGameViewComponent } from './exam-game-view.component';

describe('ExamGameViewComponent', () => {
  let component: ExamGameViewComponent;
  let fixture: ComponentFixture<ExamGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamGameViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
