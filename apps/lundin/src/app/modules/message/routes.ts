import { Routes } from "@angular/router"
import { MessageThreadComponent } from "./message-thread/message-thread.component"

export const messageRoutes: Routes = [
	{ path: ":id", component: MessageThreadComponent },
]
