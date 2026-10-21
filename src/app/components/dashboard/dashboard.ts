import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  activateDashboard: boolean = true;
  activeEvents: boolean = false;
  activateOrders: boolean = false;
  activateLogout:boolean=false;
  isMobileMenuOpen: boolean = false;
cars:[string,number,boolean]=['bmw',3,true];
school={cars:"bmw",id:3};
newO=[{name:'',id:3},{name:'',id:3}];
  constructor() {}

  ngOnInit() {

  }

  goTo(buttonType: string): void {
    // Close mobile menu when navigating
    this.isMobileMenuOpen = false;
    
    switch (buttonType) {
      case 'events':
        this.activeEvents = true;
        this.activateDashboard = false;
        this.activateOrders = false;
          this.activateLogout=false;
        break;
      case 'orders':
        this.activateOrders = true;
        this.activateDashboard = false;
        this.activeEvents = false;
          this.activateLogout=false;
        break;
        case 'logout':
          this.activateLogout=true;
           this.activateDashboard = false;
        this.activeEvents = false;
          this.activateOrders = false;
          break;
      default:
        this.activateDashboard = true;
          this.activateLogout=false;
        this.activateOrders = false;
        this.activeEvents = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
