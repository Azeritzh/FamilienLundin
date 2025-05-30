import { HttpClientModule } from "@angular/common/http"
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../services/auth.service"
import { ProfileComponent } from "./profile.component"

describe("ProfileComponent", () => {
	let component: ProfileComponent
	let fixture: ComponentFixture<ProfileComponent>

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ProfileComponent],
			imports: [/*HttpClientModule,*/ FormsModule],
			providers: [AuthService],
		}).compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () => {
		expect(component).toBeTruthy()
	})
})
