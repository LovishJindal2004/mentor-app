import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorKanbanViewComponent } from './mentor-kanban-view.component';

describe('MentorKanbanViewComponent', () => {
  let component: MentorKanbanViewComponent;
  let fixture: ComponentFixture<MentorKanbanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorKanbanViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorKanbanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
