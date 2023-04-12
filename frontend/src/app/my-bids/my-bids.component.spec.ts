import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBidsComponent } from './my-bids.component';

describe('MyBidsComponent', () => {
  let component: MyBidsComponent;
  let fixture: ComponentFixture<MyBidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyBidsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
