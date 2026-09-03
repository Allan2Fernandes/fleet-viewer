import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  httpClient = inject(HttpClient);

  public regenerateMockData(fleetSize: number): Observable<{message: string}> {
    return this.httpClient.post<{message: string}>('events/create-mock-events', {fleet_size: fleetSize});
  }
}
