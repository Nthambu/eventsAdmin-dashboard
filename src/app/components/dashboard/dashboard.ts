import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EventsService } from '../../services/events-service';
import { EventDto } from '../../data/eventsDTO.dto';
import { DialogModule } from 'primeng/dialog';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';

interface TicketTier {
  name: string;
  price: number | null;
  available: number | null;
  description:string;
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonModule, DatePipe, DialogModule, ReactiveFormsModule, FormsModule],
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
readonly school={cars:"bmw",id:3};
newO=[{name:'',id:3},{name:'',id:3}];
events:EventDto[]=[]
 newEvent = {
    name: '',
    description: '',
    event_date: '',
    venue: '',
    city: '',
state:'',
    status: 'active',
     facebook_url: '',
     image_url: '',
    ticket_types: [
      { name: 'General Admission', price: 2500, available: 200,description:'Gen z connect' }
    ] as TicketTier[]
  };

loading:boolean=true;
 // Dialog visibility state
  isCreateModalOpen = false;
  showExpiredMessage = false;
  constructor(private readonly eventsService:EventsService,private readonly toastService:ToastrService,private route:ActivatedRoute) {}

  ngOnInit() {
     this.route.queryParams.subscribe(params => {
      if (params['sessionExpired']) {
        this.showExpiredMessage = true;
      }
    });
this.fetchEvents();
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
  fetchEvents():void{
    this.loading=true;
    this.eventsService.getEvents().subscribe({
      next:(res)=>{
this.events=res;
this.toastService.success('','success');
this.loading=false;
      },
      error:(err)=>{
        this.loading=false;
        this.toastService.error('',err.error?.message)
      }
    })
  }
   openCreateModal() {
    this.isCreateModalOpen = true;
  }
   closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  // Ticket Tiers management
  addTicketTier() {
    this.newEvent.ticket_types.push({
      name: '',
      price: null,
      available: null,
      description:''
    });
  }

  removeTicketTier(index: number) {
    if (this.newEvent.ticket_types.length > 1) {
      this.newEvent.ticket_types.splice(index, 1);
    }
  }

  saveEvent() {
    this.eventsService.createEvent(this.newEvent).subscribe({
      next:(res)=>{
console.log('response',res);
this.fetchEvents();
      },
      error:(err)=>{
        console.log('errors',err.error?.message);
      }
    });
    this.closeCreateModal();
  }
}
