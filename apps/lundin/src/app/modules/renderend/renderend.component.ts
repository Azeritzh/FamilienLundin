import { Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core"
import { GameRunner } from "@lundin/age"
import { DisplayConfig, Renderend, RenderendDisplay, RenderendInput } from "@lundin/renderend"

@Component({
	selector: "lundin-renderend",
	templateUrl: "./renderend.component.html",
	styleUrls: ["./renderend.component.scss"],
})
export class RenderendComponent implements OnInit {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	game: GameRunner<any>

	constructor(private ngZone: NgZone) { }

	ngOnInit() {
		const renderend = new Renderend()
		const display = new RenderendDisplay(displayConfig, renderend, this.gameHost.nativeElement)
		const input = new RenderendInput(display.canvas)
		this.game = new GameRunner(display, input, renderend)

		input.restart()
		this.game.updateGame()

		this.sizeToAvailableSpace()
		window.onresize = this.sizeToAvailableSpace
		this.ngZone.runOutsideAngular(() => {
			this.game.startDisplayLoop()
			this.game.startGameLoop()
		})
	}

	private sizeToAvailableSpace = () => {
		this.game.setSize(
			this.gameHost.nativeElement.clientWidth,
			this.gameHost.nativeElement.clientHeight,
		)
	}
}

const displayConfig: DisplayConfig = {
	font: "Vt323",
	sprites: {
		"ship": {
			url: "assets/images/renderend/ship.png",
			width: 16,
			height: 16,
		},
		"wall": {
			url: "assets/images/renderend/wall.png",
			width: 16,
			height: 16,
		},
		"obstacle": {
			url: "assets/images/renderend/obstacle.png",
			width: 16,
			height: 16,
		},
		"big-obstacle": {
			url: "assets/images/renderend/big-obstacle.png",
			width: 32,
			height: 32,
		},
		"background": {
			url: "assets/images/renderend/starry-background.png",
			width: 220,
			height: 160,
			centerX: 0,
			centerY: 0,
		},
	},
}
