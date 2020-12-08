import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { MessageListComponent } from "./message-list.component"
import { MessageService } from "./message.service"

@NgModule({
	declarations: [MessageListComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [MessageService],
	exports: [MessageListComponent],
})
export class MessageModule { }
