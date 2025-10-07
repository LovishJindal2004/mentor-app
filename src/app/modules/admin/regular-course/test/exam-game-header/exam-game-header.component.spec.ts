import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamGameHeaderComponent } from './exam-game-header.component';

describe('ExamGameHeaderComponent', () => {
  let component: ExamGameHeaderComponent;
  let fixture: ComponentFixture<ExamGameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamGameHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamGameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
