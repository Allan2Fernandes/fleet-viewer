import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RobotActiveStatusSummary } from '../models/RobotActiveStatusSummary';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  httpClient = inject(HttpClient);

  public regenerateMockData(fleetSize: number): Observable<{message: string}> {
    return this.httpClient.post<{message: string}>('events/create-mock-events', {fleet_size: fleetSize});
  }

  public getActiveRobotsTrend(): Observable<RobotActiveStatusSummary> {
    return this.httpClient.get<RobotActiveStatusSummary>('events/active-trend');
  }
}
