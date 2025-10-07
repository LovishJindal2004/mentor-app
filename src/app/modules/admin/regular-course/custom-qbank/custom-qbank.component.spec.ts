import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQbankComponent } from './custom-qbank.component';

describe('CustomQbankComponent', () => {
  let component: CustomQbankComponent;
  let fixture: ComponentFixture<CustomQbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomQbankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomQbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
