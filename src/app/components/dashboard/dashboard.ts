import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  activateDashboard:boolean=true;
  activeEvents:boolean=false;
activateOrders:boolean=false;
constructor(){}
ngOnInit(){}
goTo(buttonType:string):void{
switch(buttonType){
case 'events':
  this.activeEvents=true;
  this.activateDashboard=false;
  this.activateOrders=false;
  break;
  case 'orders':
    this.activateOrders=true;
    this.activateDashboard=false;
    this.activeEvents=false;
    break;
  default:
      this.activateDashboard=true;
      this.activateOrders=false;
      this.activeEvents=false;
}
}
}
