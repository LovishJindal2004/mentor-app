import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbnakListComponent } from './qbnak-list.component';

describe('QbnakListComponent', () => {
  let component: QbnakListComponent;
  let fixture: ComponentFixture<QbnakListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbnakListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbnakListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
