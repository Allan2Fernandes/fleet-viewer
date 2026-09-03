import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ToastService } from "../services/toast-service";
import { inject } from "@angular/core";
import { EventApiService } from "../services/event-api-service";


type EventState = {
    loading: boolean;
};

const initialState: EventState = {
    loading: false
};



export const EventStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store) => {
        const toastService = inject(ToastService);
        const eventAPIService =  inject(EventApiService);
        return {
            generateMockEvents() {
                patchState(store, {loading: true});
                eventAPIService.regenerateMockData().subscribe({
                    next: (res: {message: string}) => {
                      patchState(store, {loading: false});
                      toastService.add({
                        id: crypto.randomUUID(),
                        type: 'success',
                        message: res.message
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
                          id: crypto.randomUUID(),
                          type: 'error',
                          message: err.error.message
                        });
                      }
                })
            },
        }
    }),
);