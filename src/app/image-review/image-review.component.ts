import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BASE_PATH, ImageRecordsService } from '@libs/api-client';

@Component({
  selector: 'app-image-review',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './image-review.component.html',
  styleUrl: './image-review.component.scss'
})
export class ImageReviewComponent implements OnChanges {
  @Input() fileName!: string;
  @Output() close = new EventEmitter<void>();
  progress = signal<number>(0);
  imageSrc: string | null = null;
  private imageService = inject(ImageRecordsService);
  private http = inject(HttpClient);
  private basePath = inject(BASE_PATH);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileName'] && this.fileName) {
      this.fetchImage();
    }
  }

  private fetchImage(): void {
    this.progress.set(0);
    this.imageSrc = null;

    let options = {
      httpHeaderAccept: 'application/octet-stream',
      context: '',
      transferCache: true
    };

    this.downloadFile(this.fileName);

    // this.imageService.apiImageRecordsImagesFileNameGet(this.fileName, 'events', true )
    //   .pipe(takeUntilDestroyed(),
    //     catchError(err => {
    //       return throwError(err)
    //     }))
    //   .subscribe(
    //     (event) => {
    //       if (event.type === HttpEventType.DownloadProgress && event.total) {
    //         this.progress.set(Math.round((100 * event.loaded) / event.total));
    //       } else if (event.type === HttpEventType.Response) {
    //         // FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' })  todo 
    //         const blob = new Blob([event.body], { type: 'image/jpeg' });
    //         this.imageSrc = URL.createObjectURL(blob); // Convert to image URL
    //       }
    //     }
    //   );


  }

  closePopup(): void {
    this.close.emit();
  }

  downloadFile(fileName: string): void {
    const headers = new HttpHeaders({
      Accept: 'application/octet-stream', // Tell the server we expect a binary file
    });

    this.http.get(`${this.basePath}/api/ImageRecords/images/${fileName}`, {
      headers: headers,
      observe: 'events',
      reportProgress: true,
      responseType: 'blob',
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.DownloadProgress && event.total) {
          this.progress.set(Math.round((100 * event.loaded) / event.total));
        } else if (event.type === HttpEventType.Response) {
          const blob = new Blob([event.body!], { type: 'image/jpeg' });
          this.imageSrc = URL.createObjectURL(blob);
          this.downloadBlob(fileName, blob);
        }

      },
      error: (err) => {
        console.log(err);
        alert("error happended");
      }
    });
  }

  downloadBlob(filename: string, blob: Blob) {
    let link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
  }


}
