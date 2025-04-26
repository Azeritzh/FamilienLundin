import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { decrypt, encrypt } from "@lundin/utility"
import { firstValueFrom } from "rxjs"

@Injectable()
export class CryptService {
	constructor(private httpClient: HttpClient) { }

	async encrypt(content: string, key: string) {
		return await encrypt(content, key)
	}

	async decrypt(encrypted: string, key: string) {
		return await decrypt(encrypted, key)
	}

	async load() {
		const response = await firstValueFrom(this.httpClient.get<{ encrypted: string }>("api/crypt/load"))
		return response.encrypted
	}

	save(encrypted: string) {
		return firstValueFrom(this.httpClient.post("api/crypt/save", { encrypted }))
	}
}