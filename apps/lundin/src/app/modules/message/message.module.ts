import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { MessageListComponent } from "./message-list/message-list.component"
import { AddMessageComponent } from "./add-message/add-message.component"
import { MessageService } from "./message.service"

@NgModule({
	declarations: [MessageListComponent, AddMessageComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [MessageService],
	exports: [MessageListComponent, AddMessageComponent],
})
export class MessageModule { }
