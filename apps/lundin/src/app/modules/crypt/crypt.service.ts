import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AES, enc } from "crypto-js"
import { firstValueFrom } from "rxjs"

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
		const response = await firstValueFrom(this.httpClient.get<{ encrypted: string }>("api/crypt/load"))
		return response.encrypted
	}

	save(encrypted: string) {
		return firstValueFrom(this.httpClient.post("api/crypt/save", { encrypted }))
	}
}