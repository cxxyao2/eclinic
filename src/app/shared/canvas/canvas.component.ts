import { ChangeDetectionStrategy, ViewChild, ElementRef, Component, viewChild, inject, AfterViewInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

const API_URL='http:///localhost:5036/api/Signature';



@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent implements AfterViewInit{
@ViewChild('canvasElement',{static:true}) canvasElement! :ElementRef<HTMLCanvasElement>;

private canvas!: HTMLCanvasElement;
private ctx!: CanvasRenderingContext2D;
private isDrawing = false;


  private http = inject(HttpClient);

  ngAfterViewInit(): void {
    this.canvas = this.canvasElement.nativeElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('touchstart', this.startDrawing.bind(this));
    this.canvas.addEventListener('touchmove', this.draw.bind(this));
    this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
  }

  private startDrawing(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    this.ctx.beginPath();
  
    const {x,y} = this.getPosition(event);
    this.ctx.moveTo(x,y);
  }

  private draw(event: MouseEvent | TouchEvent):void{
    if(!this.isDrawing) return;

    const {x, y} = this.getPosition(event);
    this.ctx.lineTo(x,y);
    this.ctx.stroke();
  }

  private stopDrawing():void{
    this.isDrawing = false;
    this.ctx.closePath();
  }

  // This method calculates the relative position of the mouse or touch event inside the canvas.
  private getPosition(event: MouseEvent | TouchEvent):{x:number, y:number}{
    const rect = this.canvas.getBoundingClientRect();
    if(event instanceof MouseEvent){
      return {x: event.clientX -rect.left, y: event.clientY - rect.top};
    } else {
      const touch = event.touches[0];
      return {x: touch.clientX - rect.left, y: touch.clientY - rect.top};
    }
  }


  clearCanvas():void{
 this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
  }

  submitSignature():void{
    const dataUrl = this.canvas.toDataURL('image/png'); 
    // const base64String = dataUrl.split(',')[1]; // Exact the base64 part of the image

        const healthRecordId= Math.round(Math.random()*1000);

    // Send the image data to the backend
    this.http.post(API_URL, {image: dataUrl, healthRecordId}).subscribe({
      next: ()=> console.log('Signature uploaded successfully'),
      error: (err) => console.error('Error uploading signature', err)
    }); 
  }

  // Capture the canvas content as based64 string
  // saveSignature() {
  //   const canvas = this.signatureCanvas();
  //   // const dataUrl = canvas.toDataURL('image/png');
  //   const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4"
  //                           + "//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
  //   if(!dataUrl) {
  //     this.errorMessage.set("Please draw soemthing in the canvas.")
  //     return;
  //   }

  //   const healthRecordId= Math.round(Math.random()*1000);

  //   // Send the image data to the backend
  //   this.http.post(API_URL, {image: dataUrl, healthRecordId}).subscribe(response=>{
  //     this.errorMessage.set(null);
  //     console.log('Signature saved',response);
  //   });

  // }
}
