import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAnalyticsComponent } from './game-analytics.component';

describe('GameAnalyticsComponent', () => {
  let component: GameAnalyticsComponent;
  let fixture: ComponentFixture<GameAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
