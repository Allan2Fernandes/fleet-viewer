import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
  Type,
} from '@angular/core';
import { TranslationService } from './translation-service';
import { Subject } from 'rxjs';
import { PopupComponent } from '../models/PopupComponent';


@Injectable({providedIn: 'root'})
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);
  open<TResult, TData>(component: Type<PopupComponent<TResult>>, data: TData): Subject<TResult>{
    const subject = new Subject<TResult>();
    const host = document.createElement('popup-host');
    const ref = createComponent(component, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [
        inputBinding('data', () => data),
        outputBinding('closed', (result: TResult) => {
          document.body.removeChild(host);
          this.appRef.detachView(ref.hostView);
          ref.destroy();
          subject.next(result);
          subject.complete();
        }),
      ],
    });

    this.appRef.attachView(ref.hostView);
    document.body.appendChild(host);
    return subject;
  }
}