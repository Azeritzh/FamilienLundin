import { Component } from "@angular/core"
import { CryptService } from "./crypt.service"
import { FormsModule } from "@angular/forms"

@Component({
	selector: "lundin-crypt",
	templateUrl: "./crypt.component.html",
	styleUrls: ["./crypt.component.scss"],
	imports: [
		FormsModule,
	],
})
export class CryptComponent {
	key = ""
	content = ""
	encrypted = ""

	constructor(private cryptService: CryptService) {
		cryptService.load().then(encrypted => this.encrypted = encrypted)
	}

	async encrypt() {
		this.encrypted = await this.cryptService.encrypt(this.content, this.key)
		this.cryptService.save(this.encrypted)
	}

	async decrypt() {
		this.content = await this.cryptService.decrypt(this.encrypted, this.key)
	}

	insertTab(textarea: HTMLTextAreaElement, event: KeyboardEvent) {
		if (event.code !== "Tab")
			return
		event.preventDefault()
		const position = textarea.selectionStart
		textarea.value = textarea.value.substring(0, position) + "\t" + textarea.value.substring(textarea.selectionEnd)
		textarea.setSelectionRange(position + 1, position + 1, "none")
	}
}
