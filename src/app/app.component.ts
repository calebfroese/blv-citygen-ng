import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RoadManager } from './road';

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
  screenTileAmount = 80;

  @ViewChild('canvas') canvasRef: ElementRef;
  ctx: CanvasRenderingContext2D;

  constructor(public roadManager: RoadManager) {}

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    // assuming an equal width and height
    const { width, height } = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.sizeX = width / this.screenTileAmount;
    this.sizeY = height / this.screenTileAmount;
    this.offsetX = (this.screenTileAmount / 2) * this.sizeX;
    this.offsetY = (this.screenTileAmount / 2) * this.sizeY;
    this.generate();
  }

  clear() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#fff';
    this.ctx.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
    this.ctx.fillStyle = '#000';
  }

  generate() {
    this.clear();
    const tiles = this.roadManager.start();
    this.ctx.fillRect(this.offsetX, this.offsetY, this.sizeX, this.sizeY);
    tiles.forEach(({ x, y }) => {
      this.tileAt(x, y);
    });
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
