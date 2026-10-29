import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EventsService } from '../../services/events-service';
import { EventDto } from '../../data/eventsDTO.dto';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CloudinaryUploadService } from '../../services/cloudinary-upload.service';

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
  @ViewChild('posterInput') posterInput!: ElementRef<HTMLInputElement>;

  activateDashboard: boolean = true;
  activeEvents: boolean = false;
  activateOrders: boolean = false;
  activateLogout: boolean = false;
  isMobileMenuOpen: boolean = false;
  events: EventDto[] = [];

  newEvent = {
    name: '',
    description: '',
    event_date: '',
    venue: '',
    city: '',
    state: '',
    facebook_url: '',
    image_url: '',
    ticket_types: [
      { name: 'General Admission', price: 2500, available: 200, description: '' }
    ] as TicketTier[]
  };

  // Poster upload state
  posterPreview: string | null = null;
  isUploading: boolean = false;

  loading: boolean = true;
  isCreateModalOpen = false;
  showExpiredMessage = false;

  constructor(
    private readonly eventsService: EventsService,
    private readonly toastService: ToastrService,
    private readonly uploadService: CloudinaryUploadService,
    private route: ActivatedRoute
  ) {}

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
    this.posterPreview = null;
    this.newEvent.image_url = '';
    if (this.posterInput?.nativeElement) {
      this.posterInput.nativeElement.value = '';
    }
  }

  onPosterSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate — images only, max 5MB
    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toastService.error('Image must be smaller than 5MB');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      this.posterPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    this.isUploading = true;
    this.uploadService.uploadImage(file).subscribe({
      next: (url) => {
        this.newEvent.image_url = url;
        this.isUploading = false;
        this.toastService.success('Poster uploaded successfully');
      },
      error: () => {
        this.isUploading = false;
        this.posterPreview = null;
        this.toastService.error('Upload failed, please try again');
      }
    });
  }

  removePoster(): void {
    this.posterPreview = null;
    this.newEvent.image_url = '';
    if (this.posterInput?.nativeElement) {
      this.posterInput.nativeElement.value = '';
    }
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
this.closeCreateModal();
this.fetchEvents();
  
      },
      error:(err)=>{
        this.toastService.success('',err.error?.message);
      }
    });
  
  }
}
