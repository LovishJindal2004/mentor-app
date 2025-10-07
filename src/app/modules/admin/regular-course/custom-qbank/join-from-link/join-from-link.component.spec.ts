import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinFromLinkComponent } from './join-from-link.component';

describe('JoinFromLinkComponent', () => {
  let component: JoinFromLinkComponent;
  let fixture: ComponentFixture<JoinFromLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinFromLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinFromLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
