import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EventsService } from '../../services/events-service';
import { EventDto } from '../../data/eventsDTO.dto';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, NgTemplateOutlet } from '@angular/common';
import { CloudinaryUploadService } from '../../services/cloudinary-upload.service';

interface TicketTier {
  name: string;
  price: number | null;
  available: number | null;
  description: string;
}

interface EventForm {
  name: string;
  description: string;
  event_date: string;
  venue: string;
  city: string;
  state: string;
  facebook_url: string;
  image_url: string;
  active: boolean;
  ticket_types: TicketTier[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgTemplateOutlet, ButtonModule, DatePipe, DialogModule, ReactiveFormsModule, FormsModule],
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

  // Blank form template — reused for both create and edit
  private blankForm(): EventForm {
    return {
      name: '',
      description: '',
      event_date: '',
      venue: '',
      city: '',
      state: '',
      facebook_url: '',
      image_url: '',
      active: true,
      ticket_types: [{ name: 'General Admission', price: null, available: null, description: '' }],
    };
  }

  eventForm: EventForm = this.blankForm();

  // Poster upload state
  posterPreview: string | null = null;
  isUploading: boolean = false;

  // Modal state
  isCreateModalOpen = false;
  isEditModalOpen = false;
  editingEventId: string | null = null;

  // Delete confirm state
  isDeleteConfirmOpen = false;
  deletingEventId: string | null = null;

  loading: boolean = true;
  isSaving: boolean = false;
  showExpiredMessage = false;

  constructor(
    private readonly eventsService: EventsService,
    private readonly toastService: ToastrService,
    private readonly uploadService: CloudinaryUploadService,
    private route: ActivatedRoute
  ) {}

  get activeEventsCount(): number {
    return this.events.filter((e) => e.active).length;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['sessionExpired']) {
        this.showExpiredMessage = true;
      }
    });
    this.fetchEvents();
  }

  goTo(buttonType: string): void {
    this.isMobileMenuOpen = false;
    switch (buttonType) {
      case 'events':
        this.activeEvents = true;
        this.activateDashboard = false;
        this.activateOrders = false;
        this.activateLogout = false;
        break;
      case 'orders':
        this.activateOrders = true;
        this.activateDashboard = false;
        this.activeEvents = false;
        this.activateLogout = false;
        break;
      case 'logout':
        this.activateLogout = true;
        this.activateDashboard = false;
        this.activeEvents = false;
        this.activateOrders = false;
        break;
      default:
        this.activateDashboard = true;
        this.activateLogout = false;
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

  fetchEvents(): void {
    this.loading = true;
    this.eventsService.getEvents().subscribe({
      next: (res) => {
        this.events = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Failed to load events');
      },
    });
  }

  // ─── Create ───────────────────────────────────────────────
  openCreateModal(): void {
    this.eventForm = this.blankForm();
    this.resetPoster();
    this.editingEventId = null;
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.resetPoster();
  }

  saveEvent(): void {
    if (!this.eventForm.name || !this.eventForm.event_date) {
      this.toastService.error('Event name and date are required');
      return;
    }
    if (this.isUploading) {
      this.toastService.error('Please wait for the poster to finish uploading');
      return;
    }
    this.isSaving = true;
    this.eventsService.createEvent(this.eventForm).subscribe({
      next: () => {
        this.toastService.success('Event created successfully');
        this.closeCreateModal();
        this.fetchEvents();
        this.isSaving = false;
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to create event');
        this.isSaving = false;
      },
    });
  }

  // ─── Edit ─────────────────────────────────────────────────
  openEditModal(event: EventDto): void {
    this.editingEventId = event.id;
    // Populate form with existing event data
    this.eventForm = {
      name: event.name,
      description: event.description,
      event_date: event.event_date,
      venue: event.venue,
      city: event.city,
      state: event.state,
      facebook_url: event.facebook_url,
      image_url: event.image_url,
      active: event.active,
      ticket_types: event.ticket_types.map((t) => ({
        name: t.name,
        price: t.price,
        available: t.available,
        description: t.description,
      })),
    };
    // Show existing image as preview
    this.posterPreview = event.image_url || null;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingEventId = null;
    this.resetPoster();
  }

  updateEvent(): void {
    if (!this.editingEventId) return;
    if (this.isUploading) {
      this.toastService.error('Please wait for the poster to finish uploading');
      return;
    }
    this.isSaving = true;
    this.eventsService.updateEvent(this.editingEventId, this.eventForm).subscribe({
      next: () => {
        this.toastService.success('Event updated successfully');
        this.closeEditModal();
        this.fetchEvents();
        this.isSaving = false;
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to update event');
        this.isSaving = false;
      },
    });
  }

  // ─── Toggle active status ─────────────────────────────────
  toggleActive(event: EventDto): void {
    this.eventsService.updateEvent(event.id, { active: !event.active }).subscribe({
      next: () => {
        event.active = !event.active;
        this.toastService.success(`Event ${event.active ? 'activated' : 'deactivated'}`);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to update status');
      },
    });
  }

  // ─── Delete ───────────────────────────────────────────────
  confirmDelete(id: string): void {
    this.deletingEventId = id;
    this.isDeleteConfirmOpen = true;
  }

  cancelDelete(): void {
    this.isDeleteConfirmOpen = false;
    this.deletingEventId = null;
  }

  deleteEvent(): void {
    if (!this.deletingEventId) return;
    this.eventsService.deleteEvent(this.deletingEventId).subscribe({
      next: () => {
        this.toastService.success('Event deleted');
        this.cancelDelete();
        this.fetchEvents();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to delete event');
        this.cancelDelete();
      },
    });
  }

  // ─── Ticket tiers ─────────────────────────────────────────
  addTicketTier(): void {
    this.eventForm.ticket_types.push({ name: '', price: null, available: null, description: '' });
  }

  removeTicketTier(index: number): void {
    if (this.eventForm.ticket_types.length > 1) {
      this.eventForm.ticket_types.splice(index, 1);
    }
  }

  // ─── Poster upload ────────────────────────────────────────
  onPosterSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toastService.error('Image must be smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.posterPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.isUploading = true;
    this.uploadService.uploadImage(file).subscribe({
      next: (url) => {
        this.eventForm.image_url = url;
        this.isUploading = false;
        this.toastService.success('Poster uploaded');
      },
      error: () => {
        this.isUploading = false;
        this.posterPreview = null;
        this.toastService.error('Upload failed, please try again');
      },
    });
  }

  removePoster(): void {
    this.posterPreview = null;
    this.eventForm.image_url = '';
    if (this.posterInput?.nativeElement) {
      this.posterInput.nativeElement.value = '';
    }
  }

  private resetPoster(): void {
    this.posterPreview = null;
    this.isUploading = false;
    if (this.posterInput?.nativeElement) {
      this.posterInput.nativeElement.value = '';
    }
  }
}
