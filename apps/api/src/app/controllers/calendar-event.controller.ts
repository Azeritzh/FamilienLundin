import type { CalendarEvent } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"

@Controller("calendar-event")
export class CalendarEventController {
	constructor(private readonly storageService: StorageService) { }

	@UseGuards(JwtAuthGuard)
	@Get("get-calendar-events")
	async getCalendarEvents() {
		return this.storageService.calendarEventCollection.find()
	}

	@UseGuards(JwtAuthGuard)
	@Post("add-calendar-event")
	async addCalendarEvent(@Body() event: CalendarEvent) {
		return this.storageService.calendarEventCollection.insertOne(event)
	}
}
