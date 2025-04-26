import { APP_BASE_HREF } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { CalendarEventListComponent } from "../../modules/calendar/calendar-event-list/calendar-event-list.component"
import { MessageListComponent } from "../../modules/message/message-list/message-list.component"
import { AuthService } from "../../services/auth.service"
import { NavigationService } from "../../services/navigation.service"
import { LoginComponent } from "../login/login.component"
import { HomeComponent } from "./home.component"

/*describe("HomeComponent", () => {
	let component: HomeComponent
	let fixture: ComponentFixture<HomeComponent>

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [HomeComponent, LoginComponent, MessageListComponent, CalendarEventListComponent],
			imports: [AppRoutingModule, BrowserModule, FormsModule, HttpClientModule],
			providers: [AuthService, NavigationService, { provide: APP_BASE_HREF, useValue: "/" }],
		}).compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () => {
		expect(component).toBeTruthy()
	})
})
*/