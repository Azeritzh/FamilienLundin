import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { AddMessageComponent } from "./add-message/add-message.component"
import { MessageListComponent } from "./message-list/message-list.component"
import { MessageThreadComponent } from "./message-thread/message-thread.component"
import { MessageService } from "./message.service"

@NgModule({
	declarations: [
		AddMessageComponent,
		MessageListComponent,
		MessageThreadComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [MessageService],
	exports: [
		AddMessageComponent,
		MessageListComponent,
		MessageThreadComponent,
	],
})
export class MessageModule { }
