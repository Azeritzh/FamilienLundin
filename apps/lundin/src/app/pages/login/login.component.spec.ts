import { APP_BASE_HREF } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { AppRoutingModule } from "../../app-routing.module"
import { AuthService } from "../../services/auth.service"
import { NavigationService } from "../../services/navigation.service"
import { LoginComponent } from "./login.component"

describe("LoginComponent", () => {
	let component: LoginComponent
	let fixture: ComponentFixture<LoginComponent>

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			imports: [AppRoutingModule, FormsModule, HttpClientModule],
			providers: [AuthService, NavigationService, { provide: APP_BASE_HREF, useValue: "/" }],
		}).compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () => {
		expect(component).toBeTruthy()
	})
})
