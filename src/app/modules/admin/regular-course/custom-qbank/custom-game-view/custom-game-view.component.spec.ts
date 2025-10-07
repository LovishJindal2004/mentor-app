import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGameViewComponent } from './custom-game-view.component';

describe('CustomGameViewComponent', () => {
  let component: CustomGameViewComponent;
  let fixture: ComponentFixture<CustomGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomGameViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
