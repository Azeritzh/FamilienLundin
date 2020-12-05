import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AES, enc } from "crypto-js"

@Injectable()
export class CryptService {
	constructor(private httpClient: HttpClient) { }

	encrypt(content: string, key: string) {
		return AES.encrypt(content, key).toString()
	}

	decrypt(encrypted: string, key: string) {
		return AES.decrypt(encrypted, key).toString(enc.Utf8)
	}

	async load() {
		const response = await this.httpClient.get<{ encrypted: string }>("api/crypt/load").toPromise()
		return response.encrypted
	}

	save(encrypted: string) {
		return this.httpClient.post("api/crypt/save", { encrypted }).toPromise()
	}
}