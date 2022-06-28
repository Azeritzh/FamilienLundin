export class ScreenSize {
	constructor(
		public renderToVirtualSize: boolean,
		public virtualPixelsPerTile: number,
		public hostWidth: number,
		public hostHeight: number,
		public virtualWidth: number,
		public virtualHeight: number,
	) { }

	get hostPixelsPerTile() { return (this.hostHeight / this.virtualHeight) * this.virtualPixelsPerTile }
	get canvasWidth() { return this.renderToVirtualSize ? this.virtualWidth : this.hostWidth }
	get canvasHeight() { return this.renderToVirtualSize ? this.virtualHeight : this.hostHeight }
	get widthInTiles() { return this.virtualWidth / this.virtualPixelsPerTile }
	get heightInTiles() { return this.virtualHeight / this.virtualPixelsPerTile }

	updateHostSize(width: number, height: number) {
		this.hostWidth = width
		this.hostHeight = height
		this.virtualWidth = this.hostWidth * (this.virtualHeight / this.hostHeight)
	}
}