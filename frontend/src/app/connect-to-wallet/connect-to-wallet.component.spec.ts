import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToWalletComponent } from './connect-to-wallet.component';

describe('ConnectToWalletComponent', () => {
  let component: ConnectToWalletComponent;
  let fixture: ComponentFixture<ConnectToWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectToWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectToWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
