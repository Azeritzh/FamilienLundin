import { Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core"
import { MeldGame } from "@lundin/meld"

@Component({
	selector: "lundin-meld",
	templateUrl: "./meld.component.html",
	styleUrls: ["./meld.component.scss"],
})
export class MeldComponent implements OnInit {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	private game: MeldGame

	constructor(private ngZone: NgZone) { }

	ngOnInit() {
		this.game = MeldGame.createAt(this.gameHost.nativeElement, { AssetFolder: "assets/images/meld/" })

		this.ngZone.runOutsideAngular(() => {
			this.game.startDisplayLoop()
			this.game.startGameLoop()
		})
	}

	ngOnDestroy() {
		this.game.onDestroy()
	}
}
