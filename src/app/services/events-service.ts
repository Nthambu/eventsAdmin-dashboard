import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventDto } from '../data/eventsDTO.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
 private readonly baseUrl=environment.baseUrl;
  constructor(private readonly http:HttpClient){}
  getEvents():Observable<EventDto[]>{
return this.http.get<EventDto[]>(
`${this.baseUrl }/events`,
)
  }
  createEvent(payload:any):Observable<any>{
    return this.http.post<any>(
     `${this.baseUrl}/events`,
      payload
    )
  }
}
