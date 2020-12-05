import { Injectable } from "@angular/core"
import { AES, enc } from "crypto-js"

@Injectable()
export class CryptService {
	encrypt(content: string, key: string) {
		return AES.encrypt(content, key).toString()
	}

	decrypt(encrypted: string, key: string) {
		return AES.decrypt(encrypted, key).toString(enc.Utf8)
	}
}