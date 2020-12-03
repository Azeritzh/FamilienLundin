import { Component } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"

@Component({
	selector: "lundin-games",
	templateUrl: "./games.component.html",
	styleUrls: ["./games.component.scss"]
})
export class GamesComponent {
	gameLink: string
	games: GameEntry[] = [
		{ text: "Minestryger", link: "http://belrokt.github.io/Minestryger/" },
		{ text: "Tern", link: "http://armienn.github.io/Tern" },
		{ text: "Piong", link: "http://armienn.github.io/archive/piong" },
		{ text: "Game of Life", link: "http://armienn.github.io/archive/game-of-life" },
		{ text: "Bilspil", link: "http://belrokt.github.io/Bilspil/" },
	]

	constructor(private sanitizer: DomSanitizer) { }

	getLink() {
		return this.sanitizer.bypassSecurityTrustResourceUrl(this.gameLink)
	}
}

interface GameEntry {
	text: string
	link: string
}
