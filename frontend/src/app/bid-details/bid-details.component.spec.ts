import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidDetailsComponent } from './bid-details.component';

describe('BidDetailsComponent', () => {
  let component: BidDetailsComponent;
  let fixture: ComponentFixture<BidDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
