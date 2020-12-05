import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { CryptComponent } from "./crypt.component"
import { CryptService } from "./crypt.service"

@NgModule({
	declarations: [CryptComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
	],
	providers: [CryptService],
})
export class CryptModule { }
