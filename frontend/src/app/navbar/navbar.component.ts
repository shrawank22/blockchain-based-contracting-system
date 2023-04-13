import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() template: TemplateRef<any>;
  status: boolean = true;

  name: string|null = localStorage.getItem('NAME');

  toggleButton(){
      this.status = !this.status;       
  }
}
