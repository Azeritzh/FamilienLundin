import { APP_BASE_HREF } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { RouterModule } from "@angular/router"
import { AppRoutingModule } from "../../app-routing.module"
import { AuthService } from "../../services/auth.service"

import { VariousComponent } from "./various.component"

describe("VariousComponent", () => {
	let component: VariousComponent
	let fixture: ComponentFixture<VariousComponent>

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [VariousComponent],
			imports: [AppRoutingModule, HttpClientModule, RouterModule],
			providers: [AuthService, { provide: APP_BASE_HREF, useValue: "/" }],
		}).compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(VariousComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () => {
		expect(component).toBeTruthy()
	})
})
