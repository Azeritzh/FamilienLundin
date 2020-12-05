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

	load() {
		return this.httpClient.get<string>("api/crypt/load").toPromise()
	}

	save(encrypted: string) {
		return this.httpClient.post("api/crypt/save", { encrypted }).toPromise()
	}
}