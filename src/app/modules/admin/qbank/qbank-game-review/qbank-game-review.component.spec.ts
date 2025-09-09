import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbankGameReviewComponent } from './qbank-game-review.component';

describe('QbankGameReviewComponent', () => {
  let component: QbankGameReviewComponent;
  let fixture: ComponentFixture<QbankGameReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbankGameReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbankGameReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
