import { Injectable, OnDestroy, signal } from '@angular/core';
import { GetInpatientDTO } from '@libs/api-client';

const url = "http://localhost:3333/sse-endpoint";

@Injectable()
export class SseClientService implements OnDestroy {

  public readonly message = signal<GetInpatientDTO[]>([]);
  private eventSource = new EventSource(url);

  constructor() {
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
