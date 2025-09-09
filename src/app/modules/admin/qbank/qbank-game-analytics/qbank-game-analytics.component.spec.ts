import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbankGameAnalyticsComponent } from './qbank-game-analytics.component';

describe('QbankGameAnalyticsComponent', () => {
  let component: QbankGameAnalyticsComponent;
  let fixture: ComponentFixture<QbankGameAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbankGameAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbankGameAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
