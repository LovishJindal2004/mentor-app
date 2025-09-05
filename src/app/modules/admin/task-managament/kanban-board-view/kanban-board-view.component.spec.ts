import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardViewComponent } from './kanban-board-view.component';

describe('KanbanBoardViewComponent', () => {
  let component: KanbanBoardViewComponent;
  let fixture: ComponentFixture<KanbanBoardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanBoardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
