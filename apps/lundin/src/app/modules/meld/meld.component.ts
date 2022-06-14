import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from "@angular/core"
import { MeldGame } from "@lundin/meld"
import { DisplayConfig } from "@lundin/renderend"

@Component({
	selector: "lundin-meld",
	templateUrl: "./meld.component.html",
	styleUrls: ["./meld.component.scss"],
})
export class MeldComponent implements AfterViewInit {
	@ViewChild("gameHost", { static: true }) gameHostElement: ElementRef<HTMLDivElement>
	game: MeldGame

	constructor(private ngZone: NgZone) { }

	ngAfterViewInit() {
		this.game = new MeldGame(this.gameHostElement.nativeElement, displayConfig)
		this.sizeToAvailableSpace()
		window.onresize = this.sizeToAvailableSpace
		this.ngZone.runOutsideAngular(() => {
			this.game.startDisplayLoop()
			this.game.startGameLoop()
		})
	}

	private sizeToAvailableSpace = () => {
		this.game.setSize(
			this.gameHostElement.nativeElement.clientWidth,
			this.gameHostElement.nativeElement.clientHeight,
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