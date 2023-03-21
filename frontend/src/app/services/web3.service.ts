import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  constructor() { }
  web3Provider:any = null;
  address: string = "";

connectToMetaMask(){

    let ethereum = (window as { [key: string]: any })['ethereum'];
    if (typeof ethereum !== 'undefined') {
      this.address = "";
      console.log('MetaMask is installed!');
    }
    if (ethereum) {
      this.web3Provider = ethereum;
      try {
        // Request account access
        ethereum.request({ method: 'eth_requestAccounts' }).then( (address:any) => {
          this.address = address[0];
          console.log("Account connected: ", address[0]); 
        });
      } catch (error) {
        // User denied account access...
        this.address = "";
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User denied account access '
        });
        console.error("User denied account access");
      }
    }
  }
}
