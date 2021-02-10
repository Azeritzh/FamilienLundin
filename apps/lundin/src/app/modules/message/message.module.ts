import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { MarkdownModule } from "ngx-markdown"
import { SharedModule } from "../../shared/shared.module"
import { AddMessageComponent } from "./add-message/add-message.component"
import { EditMessageComponent } from "./edit-message/edit-message.component"
import { MessageListComponent } from "./message-list/message-list.component"
import { MessageThreadComponent } from "./message-thread/message-thread.component"
import { MessageService } from "./message.service"

@NgModule({
	declarations: [
		AddMessageComponent,
		EditMessageComponent,
		MessageListComponent,
		MessageThreadComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		SharedModule,
	],
	providers: [MessageService],
	exports: [
		AddMessageComponent,
		EditMessageComponent,
		MessageListComponent,
		MessageThreadComponent,
	],
})
export class MessageModule { }
