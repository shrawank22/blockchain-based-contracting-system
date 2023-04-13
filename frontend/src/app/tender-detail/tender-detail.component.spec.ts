import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderDetailComponent } from './tender-detail.component';

describe('TenderDetailComponent', () => {
  let component: TenderDetailComponent;
  let fixture: ComponentFixture<TenderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
