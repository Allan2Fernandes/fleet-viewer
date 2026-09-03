import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ToastService } from "../services/toast-service";
import { inject } from "@angular/core";
import { EventApiService } from "../services/event-api-service";
import { RobotActiveStatusSummary } from "../models/RobotActiveStatusSummary";
import { v4 } from "uuid";

type RobotActiveStatusHistoryEntry = RobotActiveStatusSummary & { timestamp: number };

type EventState = {
  loading: boolean;
  RobotActiveStatusHistory: RobotActiveStatusHistoryEntry[];
};

const initialState: EventState = {
  loading: false,
  RobotActiveStatusHistory: [],
};

export const EventStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const toastService = inject(ToastService);
    const eventAPIService = inject(EventApiService);
    return {
      generateMockEvents(fleetSize: number) {
        patchState(store, { loading: true });
        eventAPIService.regenerateMockData(fleetSize).subscribe({
          next: (res: { message: string }) => {
            patchState(store, { loading: false });
            toastService.add({
              id: v4(),
              type: 'success',
              message: res.message
            });
          },
          error: (err) => {
            patchState(store, { loading: false });
            const message = err.status === 0
              ? 'Unable to connect to the server'
              : err.error?.message ?? 'Something went wrong';
            toastService.add({
              id: v4(),
              type: 'error',
              message
            });
          }
        })
      },
      getRobotActiveStatusSummary() {
        patchState(store, { loading: true });
        eventAPIService.getActiveRobotsTrend().subscribe({
          next: (res: RobotActiveStatusSummary) => {
            patchState(store, {
              loading: false,
              RobotActiveStatusHistory: [
                ...store.RobotActiveStatusHistory(),
                { ...res, timestamp: Date.now() }
              ]
            });
          },
          error: (err) => {
            patchState(store, { loading: false });
            const message = err.status === 0
              ? 'Unable to connect to the server'
              : err.error?.message ?? 'Something went wrong';
            toastService.add({
              id: v4(),
              type: 'error',
              message
            });
          }
        })
      },
    }
  }),
);