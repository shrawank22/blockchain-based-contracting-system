import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTendersComponent } from './active-tenders.component';

describe('ActiveTendersComponent', () => {
  let component: ActiveTendersComponent;
  let fixture: ComponentFixture<ActiveTendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveTendersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveTendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
