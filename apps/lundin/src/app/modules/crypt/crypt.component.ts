import { Component } from "@angular/core"
import { AES, enc } from "crypto-js"

@Component({
	selector: "lundin-crypt",
	templateUrl: "./crypt.component.html",
	styleUrls: ["./crypt.component.scss"],
})
export class CryptComponent {
	key = ""
	content = ""
	encrypted = "U2FsdGVkX1/jGbqemIDO8kirGU7QAlxysqZb/uwqfw/DWncmuJfpyAeoGen1lzHw"

	encrypt(){
		this.encrypted = AES.encrypt(this.content, this.key).toString()
	}

	decrypt(){
		this.content = AES.decrypt(this.encrypted, this.key).toString(enc.Utf8)
	}
}
