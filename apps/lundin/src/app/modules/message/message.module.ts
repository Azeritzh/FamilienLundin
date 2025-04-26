import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { RouterModule } from "@angular/router"
import { MarkdownModule } from "ngx-markdown"
import { SharedModule } from "../../shared/shared.module"
import { AddMessageComponent } from "./add-message/add-message.component"
import { EditMessageComponent } from "./edit-message/edit-message.component"
import { MessageListComponent } from "./message-list/message-list.component"
import { MessageRootComponent } from "./message-root/message-root.component"
import { MessageThreadComponent } from "./message-thread/message-thread.component"
import { MessageService } from "./message.service"

@NgModule({
	declarations: [
		AddMessageComponent,
		EditMessageComponent,
		MessageListComponent,
		MessageRootComponent,
		MessageThreadComponent,
	],
	imports: [
		CommonModule,
		MarkdownModule.forRoot(),
		SharedModule,
		RouterModule,
	],
	providers: [MessageService],
	exports: [
		AddMessageComponent,
		EditMessageComponent,
		MessageListComponent,
		MessageRootComponent,
		MessageThreadComponent,
	],
})
export class MessageModule { }
