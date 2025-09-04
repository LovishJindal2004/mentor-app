import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCourseFormComponent } from './assign-course-form.component';

describe('AssignCourseFormComponent', () => {
  let component: AssignCourseFormComponent;
  let fixture: ComponentFixture<AssignCourseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignCourseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
