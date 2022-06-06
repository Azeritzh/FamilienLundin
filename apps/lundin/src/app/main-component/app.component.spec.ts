import { APP_BASE_HREF } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"
import { TestBed, waitForAsync } from "@angular/core/testing"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "../app-routing.module"
import { AuthService } from "../services/auth.service"
import { NavigationService } from "../services/navigation.service"
import { UserService } from "../services/user.service"
import { SharedModule } from "../shared/shared.module"
import { AppComponent } from "./app.component"

describe("AppComponent", () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [AppRoutingModule, BrowserModule, HttpClientModule, SharedModule],
			providers: [AuthService, NavigationService, UserService, { provide: APP_BASE_HREF, useValue: "/" }],
		}).compileComponents()
	}))

	it("should create the app", () => {
		const fixture = TestBed.createComponent(AppComponent)
		const app = fixture.debugElement.componentInstance
		expect(app).toBeTruthy()
	})
})
