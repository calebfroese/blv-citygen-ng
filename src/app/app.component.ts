import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sizeX; sizeY;
  screenTileAmount = 10;

  @ViewChild('canvas') canvasRef: ElementRef;
  ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    // assuming an equal width and height
    const { width, height } = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.sizeX = width / this.screenTileAmount;
    this.sizeY = height / this.screenTileAmount;
    
    this.tileAt(0, 0);
    this.draw();
  }

  // Create a tile at the following coordinates
  tileAt(x: number, y: number) {
    this.ctx.rect(x * this.sizeX, y * this.sizeY, this.sizeX, this.sizeY);
  }

  draw() {
    this.ctx.stroke();
  }
}
