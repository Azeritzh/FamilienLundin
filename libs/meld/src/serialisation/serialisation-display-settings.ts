import { Input } from "../display/services/input"
import { DisplaySettings } from "../display/state/display-settings"

export function readDisplaySettings(deserialised: SerialisableDisplaySettings): DisplaySettings {

	const inputs = new Map<Input, string[]>()
	for (const key in deserialised.inputs)
		inputs.set(Input[key], deserialised.inputs[key])

	return {
		Inputs: inputs,
	}
}

export interface SerialisableDisplaySettings {
	inputs: { [input: string]: string[] },
}
