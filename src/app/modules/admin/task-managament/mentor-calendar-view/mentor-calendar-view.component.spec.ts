import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorCalendarViewComponent } from './mentor-calendar-view.component';

describe('MentorCalendarViewComponent', () => {
  let component: MentorCalendarViewComponent;
  let fixture: ComponentFixture<MentorCalendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorCalendarViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
