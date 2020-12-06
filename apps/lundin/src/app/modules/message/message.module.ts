import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { MessageService } from "./message.service"

@NgModule({
	declarations: [],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [MessageService],
})
export class MessageModule { }
