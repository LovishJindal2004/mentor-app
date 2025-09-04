import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMentorComponent } from './assign-mentor.component';

describe('AssignMentorComponent', () => {
  let component: AssignMentorComponent;
  let fixture: ComponentFixture<AssignMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
