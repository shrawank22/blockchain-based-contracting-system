import { Component } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-connect-to-wallet',
  templateUrl: './connect-to-wallet.component.html',
  styleUrls: ['./connect-to-wallet.component.scss']
})
export class ConnectToWalletComponent {
  constructor(private web3Service:Web3Service){}
  connectToWallet(){
    this.web3Service.connectToMetaMask();
  }
}
