import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbankGameViewComponent } from './qbank-game-view.component';

describe('QbankGameViewComponent', () => {
  let component: QbankGameViewComponent;
  let fixture: ComponentFixture<QbankGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbankGameViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbankGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
