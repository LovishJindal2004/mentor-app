import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGameHeaderComponent } from './custom-game-header.component';

describe('CustomGameHeaderComponent', () => {
  let component: CustomGameHeaderComponent;
  let fixture: ComponentFixture<CustomGameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomGameHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomGameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
