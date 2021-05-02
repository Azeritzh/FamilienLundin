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
	static Boids = {
		setup: `for(let i = 0; i<100; i++)
	state.newAgent(config)
`,
		agentSetup: `agent.position.x = Math.random() * config.width
	agent.position.y = Math.random() * config.height
	agent.orientation = Math.random() * Math.PI * 2
	agent.velocity.x = 1
	agent.velocity.y = 0
	agent.velocity = agent.velocity.rotate(agent.orientation).multiply(Math.random())
`,
		agentUpdate: `
const agentsWithDistance = state.agents
	.map(x => ({ distance: x.position.subtract(agent.position).lengthSquared(), agent: x}) )
	.sort((a,b) => a.distance - b.distance)

function avoidNearby() {
	const nearestOne = agentsWithDistance[1]
	const avoidanceVector = agent.position.subtract(nearestOne.agent.position)
		.unitVector()
		.multiply(20/nearestOne.distance)
	agent.velocity = agent.velocity.add(avoidanceVector)
}

function alignWithNearby() {
	const nearestFew = agentsWithDistance.slice(1, 5)
	const averageVelocity = nearestFew
		.map(x => x.agent.velocity.multiply(1/nearestFew.length))
		.reduce((p, c) => p.add(c), agent.velocity.multiply(0))
	agent.velocity = agent.velocity.multiply(0.8).add(averageVelocity.multiply(0.2))
}

function headToWithNearby() {
	const nearestFew = agentsWithDistance.slice(1, 10)
	const averagePosition = nearestFew
		.map(x => x.agent.position.multiply(1/nearestFew.length))
		.reduce((p, c) => p.add(c), agent.position.multiply(0))
	const heading = averagePosition.subtract(agent.position).unitVector()
	agent.velocity = agent.velocity.add(heading.multiply(0.1))
}

function avoidWalls() {
	const distanceLeft = agent.position.x
	const distanceRight = config.width - agent.position.x
	let horisontalAvoidance = 0
	if(distanceLeft<20)
		horisontalAvoidance = 5/distanceLeft
	else if(distanceRight<20)
		horisontalAvoidance = -5/distanceRight
		
	const distanceTop = agent.position.y
	const distanceBottom = config.height - agent.position.y
	let verticalAvoidance = 0
	if(distanceTop<20)
		verticalAvoidance = 5/distanceTop
	else if(distanceBottom<20)
		verticalAvoidance = -5/distanceBottom

	const vector = agent.velocity.copy()
	vector.set(horisontalAvoidance, verticalAvoidance)
	agent.velocity = agent.velocity.add(vector)
}

function limitSpeed() {
	const lengthSquared = agent.velocity.lengthSquared()
	if(lengthSquared > 9)
	agent.velocity = agent.velocity.unitVector().multiply(3)
}

avoidNearby()
alignWithNearby()
headToWithNearby()
avoidWalls()
limitSpeed()

const nearestFew = agentsWithDistance.slice(1, 5)

agent.orientation = agent.velocity.angle()
`,
	}
}