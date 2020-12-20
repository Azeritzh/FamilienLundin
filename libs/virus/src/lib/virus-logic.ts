import { GameLogic } from "@lundin/age"
import { VirusState } from "./virus-state"

export class VirusLogic implements GameLogic<VirusAction> {
	constructor(private readonly state: VirusState) { }

	update(actions: VirusAction[]): void {
		throw new Error("Not implemented")
	}

	static validate(state: VirusState, action: VirusAction): { isValid: boolean, problems: string[] } {
		throw new Error("Not implemented")
	}
}

export class VirusAction { }
