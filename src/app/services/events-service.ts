import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventDto } from '../data/eventsDTO.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.baseUrl}/events`);
  }

  createEvent(payload: any): Observable<EventDto> {
    return this.http.post<EventDto>(`${this.baseUrl}/events`, payload);
  }

  updateEvent(id: string, payload: any): Observable<EventDto> {
    return this.http.patch<EventDto>(`${this.baseUrl}/events/${id}`, payload);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/events/${id}`);
  }
}
