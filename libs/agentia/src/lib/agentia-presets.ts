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
		click: `const current = state.world.get(Math.floor(x), Math.floor(y))
state.world.set(Math.floor(x), Math.floor(y), current ? 0 : 1)
`,
	}
	static Boids = {
		setup: `config.numberOfBoids = 100
config.nearbyAvoidanceFactor = 20
config.nearestToAlignWith = 5
config.alignmentFactor = 0.2
config.nearestToHeadFor = 10
config.headingFactor = 0.1
config.wallAvoidanceFactor = 5
config.accelerationLimit = 0.5
config.speedLimit = 3

for(let i = 0; i<config.numberOfBoids; i++)
	state.newAgent(config)
`,
		agentSetup: `agent.position.x = Math.random() * config.width
	agent.position.y = Math.random() * config.height
	agent.orientation = Math.random() * Math.PI * 2
	agent.velocity.x = 1
	agent.velocity.y = 0
	agent.velocity = agent.velocity.rotate(agent.orientation).multiply(Math.random())
`,
		agentUpdate: `let acceleration = agent.velocity.multiply(0)
const agentsWithDistance = state.agents
	.map(x => ({ distance: x.position.subtract(agent.position).lengthSquared(), agent: x}) )
	.sort((a,b) => a.distance - b.distance)

function avoidNearby() {
	const nearestOne = agentsWithDistance[1]
	const avoidanceVector = agent.position.subtract(nearestOne.agent.position)
		.unitVector()
		.multiply(config.nearbyAvoidanceFactor/nearestOne.distance)
		acceleration = acceleration.add(avoidanceVector)
}

function alignWithNearby() {
	const nearestFew = agentsWithDistance.slice(1, config.nearestToAlignWith)
	const averageVelocity = nearestFew
		.map(x => x.agent.velocity.multiply(1/nearestFew.length))
		.reduce((p, c) => p.add(c), agent.velocity.multiply(0))
		acceleration = acceleration.add(averageVelocity.multiply(config.alignmentFactor))
}

function headToWithNearby() {
	const nearestFew = agentsWithDistance.slice(1, config.nearestToHeadFor)
	const averagePosition = nearestFew
		.map(x => x.agent.position.multiply(1/nearestFew.length))
		.reduce((p, c) => p.add(c), agent.position.multiply(0))
	const heading = averagePosition.subtract(agent.position).unitVector()
	acceleration = acceleration.add(heading.multiply(config.headingFactor))
}

function avoidWalls() {
	const distanceLeft = agent.position.x
	const distanceRight = config.width - agent.position.x
	let horisontalAvoidance = 0
	if(distanceLeft<20)
		horisontalAvoidance = config.wallAvoidanceFactor/distanceLeft
	else if(distanceRight<20)
		horisontalAvoidance = -config.wallAvoidanceFactor/distanceRight
		
	const distanceTop = agent.position.y
	const distanceBottom = config.height - agent.position.y
	let verticalAvoidance = 0
	if(distanceTop<20)
		verticalAvoidance = config.wallAvoidanceFactor/distanceTop
	else if(distanceBottom<20)
		verticalAvoidance = -config.wallAvoidanceFactor/distanceBottom

	const vector = agent.velocity.copy()
	vector.set(horisontalAvoidance, verticalAvoidance)
	acceleration = acceleration.add(vector)
}

function limitAcceleration() {
	const lengthSquared = acceleration.lengthSquared()
	if(lengthSquared > (config.accelerationLimit*config.accelerationLimit))
	acceleration = acceleration.unitVector().multiply(config.accelerationLimit)
}

function limitSpeed() {
	const lengthSquared = agent.velocity.lengthSquared()
	if(lengthSquared > (config.speedLimit * config.speedLimit))
	agent.velocity = agent.velocity.unitVector().multiply(config.speedLimit)
}

avoidNearby()
alignWithNearby()
headToWithNearby()
limitAcceleration()
avoidWalls()
agent.velocity = agent.velocity.add(acceleration)
limitSpeed()

const nearestFew = agentsWithDistance.slice(1, 5)

agent.orientation = agent.velocity.angle()
`,
		click: `const agent = state.newAgent(config)
agent.position.set(x, y)
`,
	}
}