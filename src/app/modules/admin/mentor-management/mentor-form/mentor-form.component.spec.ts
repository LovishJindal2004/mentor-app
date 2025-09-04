import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorFormComponent } from './mentor-form.component';

describe('MentorFormComponent', () => {
  let component: MentorFormComponent;
  let fixture: ComponentFixture<MentorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
