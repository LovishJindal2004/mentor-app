import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssignedStudentsComponent } from './task-assigned-students.component';

describe('TaskAssignedStudentsComponent', () => {
  let component: TaskAssignedStudentsComponent;
  let fixture: ComponentFixture<TaskAssignedStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAssignedStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAssignedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
