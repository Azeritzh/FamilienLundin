export class ScreenSize {
	constructor(
		public RenderToVirtualSize: boolean,
		public VirtualPixelsPerTile: number,
		public HostWidth: number,
		public HostHeight: number,
		public VirtualWidth: number,
		public VirtualHeight: number,
	) { }

	get HostPixelsPerTile() { return (this.HostHeight / this.VirtualHeight) * this.VirtualPixelsPerTile }
	get CanvasWidth() { return this.RenderToVirtualSize ? this.VirtualWidth : this.HostWidth }
	get CanvasHeight() { return this.RenderToVirtualSize ? this.VirtualHeight : this.HostHeight }
	get WidthInTiles() { return this.VirtualWidth / this.VirtualPixelsPerTile }
	get HeightInTiles() { return this.VirtualHeight / this.VirtualPixelsPerTile }

	UpdateHostSize(width: number, height: number) {
		this.HostWidth = width
		this.HostHeight = height
		this.VirtualWidth = this.HostWidth * (this.VirtualHeight / this.HostHeight)
	}
}