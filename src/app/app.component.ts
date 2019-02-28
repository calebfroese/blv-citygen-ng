import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Size in pixels of a tile
  sizeX;
  sizeY;
  // Offset in pixels from the origin (0,0) coord
  offsetX;
  offsetY;
  // How many tiles to fit in the screen vertically and horizontally
  screenTileAmount = 50;

  @ViewChild('canvas') canvasRef: ElementRef;
  ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    // assuming an equal width and height
    const { width, height } = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.sizeX = width / this.screenTileAmount;
    this.sizeY = height / this.screenTileAmount;
    this.offsetX = (this.screenTileAmount / 2) * this.sizeX;
    this.offsetY = (this.screenTileAmount / 2) * this.sizeY;

    this.tileAt(0, 0);
    this.draw();
  }

  // Create a tile at the following coordinates
  tileAt(x: number, y: number) {
    this.ctx.rect(
      x * this.sizeX + this.offsetX,
      y * this.sizeY + this.offsetY,
      this.sizeX,
      this.sizeY
    );
  }

  // Draw the canvas
  draw() {
    this.ctx.stroke();
  }
}
