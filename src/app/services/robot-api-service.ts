import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Robot } from '../models/Robot';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RobotApiService {
  httpClient = inject(HttpClient);

  getRobotLatestEvents(selectedRobotIds: Set<string>): Observable<Robot[]> {
    const robotIds: string[] = Array.from(selectedRobotIds);
    return this.httpClient.post<Robot[]>('robots/latest-positions',{robot_ids: robotIds});
  }

  getListOfRobots(): Observable<Robot[]> {
    return this.httpClient.post<Robot[]>('robots/', {});
  }
}
