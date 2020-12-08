import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { MessageListComponent } from "./message-list/message-list.component"
import { AddThreadComponent } from "./add-thread/add-thread.component"
import { MessageService } from "./message.service"

@NgModule({
	declarations: [MessageListComponent, AddThreadComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [MessageService],
	exports: [MessageListComponent, AddThreadComponent],
})
export class MessageModule { }
