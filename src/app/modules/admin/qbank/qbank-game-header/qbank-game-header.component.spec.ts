import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbankGameHeaderComponent } from './qbank-game-header.component';

describe('QbankGameHeaderComponent', () => {
  let component: QbankGameHeaderComponent;
  let fixture: ComponentFixture<QbankGameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbankGameHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbankGameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
