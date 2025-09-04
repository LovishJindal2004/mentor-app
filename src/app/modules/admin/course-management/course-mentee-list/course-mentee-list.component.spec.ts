import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMenteeListComponent } from './course-mentee-list.component';

describe('CourseMenteeListComponent', () => {
  let component: CourseMenteeListComponent;
  let fixture: ComponentFixture<CourseMenteeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMenteeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseMenteeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
