import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStudentReportComponent } from './task-student-report.component';

describe('TaskStudentReportComponent', () => {
  let component: TaskStudentReportComponent;
  let fixture: ComponentFixture<TaskStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStudentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
