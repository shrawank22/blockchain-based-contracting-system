import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsDetailsComponent } from './bids-details.component';

describe('BidsDetailsComponent', () => {
  let component: BidsDetailsComponent;
  let fixture: ComponentFixture<BidsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
