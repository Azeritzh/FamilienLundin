import { Component, OnInit } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"
import { ActivatedRoute } from "@angular/router"

@Component({
	selector: "lundin-iframe-game",
	templateUrl: "./iframe-game.component.html",
	styleUrls: ["./iframe-game.component.scss"],
	standalone: false,
})
export class IframeGameComponent implements OnInit {
	gameLink: string = ""
	games: { [index: string]: string } = {
		"minestryger": "http://belrokt.github.io/Minestryger/",
		"tern": "http://armienn.github.io/Tern",
		"piong": "http://armienn.github.io/archive/piong",
		"game-of-life": "http://armienn.github.io/archive/game-of-life",
		"bilspil": "http://belrokt.github.io/Bilspil/",
	}

	constructor(
		private activatedRoute: ActivatedRoute,
		private sanitizer: DomSanitizer,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const game = params.get("game") ?? "tern"
			this.gameLink = this.games[game]
		})
	}

	getLink() {
		return this.sanitizer.bypassSecurityTrustResourceUrl(this.gameLink)
	}
}
