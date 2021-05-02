export class AgentiaPresets {
	static GameOfLife = {
		setup: `for(const { x, y } of state.world.allFields()) {
	if(Math.random() > 0.5) {
		state.world.set(x, y, 1)
	}
}
state.newWorld = new state.world.constructor(config.width, config.height, () => 0)
`,
		update: `for(const { x, y } of state.world.allFields()) {
	const thisField = state.world.get(x, y)
	let count = -thisField
	for(const { field } of state.world.fieldsAround(x,y))
		count += field
	if(thisField && (count == 2 || count == 3))
		state.newWorld.set(x, y, 1)
	else if(count == 3)
		state.newWorld.set(x, y, 1)
	else
		state.newWorld.set(x, y, 0)
}
const temp = state.newWorld
state.newWorld = state.world
state.world = temp
`,
	}
}