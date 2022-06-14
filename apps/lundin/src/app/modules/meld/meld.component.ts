import { Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core"
import { GameRunner } from "@lundin/age"
import { DisplayConfig, Meld, MeldDisplay, MeldInput } from "@lundin/meld"

@Component({
	selector: "lundin-meld",
	templateUrl: "./meld.component.html",
	styleUrls: ["./meld.component.scss"],
})
export class MeldComponent implements OnInit {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	game: GameRunner<any>

	constructor(private ngZone: NgZone) { }

	ngOnInit() {
		const meld = new Meld()
		const display = new MeldDisplay(displayConfig, meld, this.gameHost.nativeElement)
		const input = new MeldInput(display.canvas)
		this.game = new GameRunner(display, input, meld)

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
	sprites: {
		"tile-dirt": {
			url: "assets/images/meld/tile-dirt.png",
			width: 16,
			height: 16,
		},
		"tile-earth": {
			url: "assets/images/meld/tile-earth.png",
			width: 16,
			height: 16,
		},
		"tile-grass": {
			url: "assets/images/meld/tile-grass.png",
			width: 16,
			height: 16,
		},
		"tile-slab": {
			url: "assets/images/meld/tile-slab.png",
			width: 16,
			height: 16,
		},
		"tile-stone": {
			url: "assets/images/meld/tile-stone.png",
			width: 16,
			height: 16,
		},
		"tile-wooden": {
			url: "assets/images/meld/tile-wooden.png",
			width: 16,
			height: 16,
		},
	},
}