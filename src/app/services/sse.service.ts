import { Inject, Injectable, OnDestroy, Optional, signal } from '@angular/core';
import { GetInpatientDTO } from '@libs/api-client';
import { BASE_PATH } from '@libs/api-client/variables';


@Injectable()
export class SseClientService implements OnDestroy {
  url = `/api/Sse/sse-endpoint`;

  public readonly message = signal<GetInpatientDTO[]>([]);
  private eventSource: EventSource;

  constructor(@Optional() @Inject(BASE_PATH) basePath: string | string[]) {
    this.url = basePath + this.url;
    this.eventSource = new EventSource(this.url);

    this.eventSource.onmessage = (event) => {
      this.message.set(event.data); // todo. need extract array from response
    };

    this.eventSource.onerror = (error) => {
      console.error(error);
      this.message.set([]);
    };

  }

  ngOnDestroy(): void {
    console.log("Sse client exited.");
    this.eventSource.close();
  }
}
