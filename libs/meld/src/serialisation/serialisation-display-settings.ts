import { Input } from "../display/services/input"
import { DisplaySettings } from "../display/state/display-settings"

export function readDisplaySettings(deserialised: SerialisableDisplaySettings): DisplaySettings {

	const inputs = new Map<Input, string[]>()
	for (const key in deserialised.Inputs)
		inputs.set(Input[key], deserialised.Inputs[key])

	return {
		Inputs: inputs,
	}
}

export interface SerialisableDisplaySettings {
	Inputs: { [input: string]: string[] },
}
