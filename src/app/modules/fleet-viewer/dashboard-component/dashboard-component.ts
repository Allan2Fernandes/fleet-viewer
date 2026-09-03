import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { RobotStore } from '../../../stores/robots.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, Subscription, switchMap, take, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Robot } from '../../../models/Robot';
import { NavBar } from '../../shared/nav-bar/nav-bar';

@Component({
  selector: 'app-dashboard-component',
  imports: [AsyncPipe, NavBar],
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private robotStore = inject(RobotStore);
  subscription: Subscription[] = [];

  @ViewChild('robotCanvas')
  private canvas!: ElementRef<HTMLCanvasElement>;

  robotsLatestEvents = this.robotStore.latestRobotEvents;
  robotsLatestEvents$ = toObservable(this.robotStore.latestRobotEvents);

  listOfRobots = this.robotStore.listOfRobots;
  listOfRobots$ = toObservable(this.listOfRobots);

  selectedRobotIds = new Set<string>();

  
  pollingInterval$ = new BehaviorSubject<number>(5000);

  toggleRobot(robotId: string): void {
    if (this.selectedRobotIds.has(robotId)) {
      this.selectedRobotIds.delete(robotId);
    } else {
      this.selectedRobotIds.add(robotId);
    }

    this.draw();
  }

  ngOnInit(): void {
    this.robotStore.getListOfRobots();
    this.draw();

    this.subscription.push(
      this.listOfRobots$.subscribe(list => {
        list.forEach(robot => {
          this.selectedRobotIds.add(robot.id);
        });
        this.draw();
      }),
      this.pollingInterval$.pipe(
        switchMap(interval => timer(0, interval))
      ).subscribe(() => {
        this.robotStore.getRobotsLatestEvents(this.selectedRobotIds);
      }),
      this.robotsLatestEvents$.subscribe(() => {
        this.draw();
      }),
    );
  }

  changePollingInterval(event: Event): void {
    const input = event.target as HTMLInputElement;

    const pollingInterval = Number(input.value);

    this.pollingInterval$.next(pollingInterval);
  }

  draw(): void {
    if (!this.canvas) {
      return;
    }

    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawGrid(ctx);
    this.drawRobots(ctx);
  }

  private drawGrid(ctx: CanvasRenderingContext2D): void {
    const width = 900;
    const height = 560;
    const gridSize = 100;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  private drawRobots(ctx: CanvasRenderingContext2D): void {
    const robots = this.robotsLatestEvents();

    for (const robot of robots) {
      const latestEvent = robot.events?.[0];

      if (!latestEvent) {
        continue;
      }

      this.drawRobot(
        ctx,
        latestEvent.x,
        latestEvent.y,
        robot,
        latestEvent.status,
      );
    }
  }

  private drawRobot(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    robot: Robot,
    status: string,
  ): void {

    const radius = 12;

    // Robot body
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = robot.type === 'Picker'
      ? '#3b82f6'
      : '#f97316';

    ctx.fill();

    // Border
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Robot ID / type
    ctx.fillStyle = '#111827';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
      robot.type,
      x,
      y - radius - 6,
    );

    // Status indicator
    ctx.beginPath();
    ctx.arc(
      x + radius - 2,
      y - radius + 2,
      4,
      0,
      Math.PI * 2,
    );

    ctx.fillStyle = this.getStatusColor(status);
    ctx.fill();
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return '#22c55e';

      case 'idle':
        return '#eab308';

      case 'maintenance':
        return '#ef4444';

      default:
        return '#6b7280';
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(s => s.unsubscribe());
  }
}