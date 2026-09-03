import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ToastService } from "../services/toast-service";
import { inject } from "@angular/core";
import { RobotApiService } from "../services/robot-api-service";
import { Robot } from "../models/Robot";
import { v4 } from "uuid";

type RobotState = {
    latestRobotEvents: Robot[];
    listOfRobots: Robot[];
    loading: boolean;
};

const initialState: RobotState = {
    latestRobotEvents: [],
    listOfRobots: [],
    loading: false
};



export const RobotStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store) => {
        const toastService = inject(ToastService);
        const robotApiService =  inject(RobotApiService);
        return {
            getRobotsLatestEvents(selectedRobotIds: Set<string>) {
                patchState(store, {loading: true});
                robotApiService.getRobotLatestEvents(selectedRobotIds).subscribe({
                    next: (res: Robot[]) => {
                      patchState(store, {latestRobotEvents: res, loading: false});
                    },
                    error: (err) => {
                        patchState(store, {loading: false});
                        let message = 'Something went wrong';
                        if (err.status === 0) {
                            message = 'Unable to connect to the server';
                        } else {
                            message = err.error?.message ?? 'Something went wrong';
                        }
                        toastService.add({
                          id: v4(),
                          type: 'error',
                          message: err.error.message
                        });
                      }
                })
            },
            getListOfRobots() {
                patchState(store, {loading: true});
                robotApiService.getListOfRobots().subscribe({
                    next: (res: Robot[]) => {
                      patchState(store, {listOfRobots: res, loading: false});
                      toastService.add({
                          id: v4(),
                          type: 'success',
                          message: 'SuccessFully fetched robots'
                        });
                    },
                    error: (err) => {
                        patchState(store, {loading: false});
                        let message = 'Something went wrong';
                        if (err.status === 0) {
                            message = 'Unable to connect to the server';
                        } else {
                            message = err.error?.message ?? 'Something went wrong';
                        }
                        toastService.add({
                          id: v4(),
                          type: 'error',
                          message: err.error.message
                        });
                      }
                })
            }
        }
    }),
);