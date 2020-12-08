import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
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
		HttpClientModule,
		SharedModule,
	],
	providers: [MessageService],
	exports: [
		AddMessageComponent,
		MessageListComponent,
		MessageThreadComponent,
	],
})
export class MessageModule { }
