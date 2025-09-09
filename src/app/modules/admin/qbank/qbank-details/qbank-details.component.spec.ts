import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbankDetailsComponent } from './qbank-details.component';

describe('QbankDetailsComponent', () => {
  let component: QbankDetailsComponent;
  let fixture: ComponentFixture<QbankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbankDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
