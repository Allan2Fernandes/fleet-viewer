import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  viewChild
} from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from 'ng-apexcharts';
import { EventStore } from '../../../stores/events.store';
import { BehaviorSubject, Subscription, switchMap, timer } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { NavBar } from "../../shared/nav-bar/nav-bar";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-trend-viewer',
  imports: [ChartComponent, NavBar],
  templateUrl: './trend-viewer.html',
})
export class TrendViewer implements OnInit, OnDestroy {
  eventStore = inject(EventStore);

  subscriptions: Subscription[] = [];
  pollingInterval$ = new BehaviorSubject<number>(5000);

  robotActiveStatusHistory = this.eventStore.RobotActiveStatusHistory;
  robotActiveStatusHistory$ = toObservable(this.robotActiveStatusHistory);
  private readonly chartRef = viewChild.required(ChartComponent);

  private lastRenderedCount = 0;

  chart: ApexChart = {
    type: 'line',
    height: 400,
    animations: {
      enabled: true,
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: true
    }
  };

  series: ApexAxisChartSeries = [
    {
      name: 'Active Robots',
      data: []
    },
    {
      name: 'Idle Robots',
      data: []
    },
    {
      name: "Maintenance Robots",
      data: []
    }
  ];

  xaxis: ApexXAxis = {
    type: 'datetime',
    range: 60000
  };

  yaxis: ApexYAxis = {
    min: 0,
    title: {
      text: 'Active Robots'
    }
  };

  ngOnInit(): void {
    this.subscriptions.push(
      this.pollingInterval$.pipe(
        switchMap(interval => timer(0, interval))
      ).subscribe(() => {
        this.eventStore.getRobotActiveStatusSummary();
      }),

      this.robotActiveStatusHistory$.subscribe(history => {
        if (history.length <= this.lastRenderedCount) {
          return;
        }

        const newPointsActive = history.slice(this.lastRenderedCount).map(entry => ({
          x: entry.timestamp,
          y: entry.active_count
        }));

        const newPointsIdle = history.slice(this.lastRenderedCount).map(entry => ({
          x: entry.timestamp,
          y: entry.idle_count
        }));

        const newPointsMaintenance = history.slice(this.lastRenderedCount).map(entry => ({
          x: entry.timestamp,
          y: entry.maintenance_count
        }));
        

        this.lastRenderedCount = history.length;

        this.chartRef().appendData([
          { data: newPointsActive },
          { data: newPointsIdle},
          { data: newPointsMaintenance}
        ]);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}