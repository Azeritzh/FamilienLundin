import { GenericShader } from "./generic-shader"

const vertexShader = `
attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
uniform mat3 uWorld;
uniform mat3 uObject;
uniform vec2 uFrame;
void main(void) {
gl_Position = vec4(uWorld * uObject * vec3(aPosition, 1), 1);
vTexCoord = aTexCoord + uFrame;
}`

const fragmentShader = `
precision mediump float;
uniform sampler2D uImage;
varying vec2 vTexCoord;
void main(void) {
gl_FragColor = texture2D(uImage, vTexCoord);
}`

export class StandardShader extends GenericShader {
	constructor(
		gl: WebGL2RenderingContext,
		public aPositionLocation?: number,
		public aTexCoordLocation?: number,
		public uImageLocation?: WebGLUniformLocation,
		public uWorldLocation?: WebGLUniformLocation,
		public uObjectLocation?: WebGLUniformLocation,
		public uFrameLocation?: WebGLUniformLocation,
	) {
		super(gl, vertexShader, fragmentShader)
		this.aPositionLocation = gl.getAttribLocation(this.program, "aPosition")
		this.aTexCoordLocation = gl.getAttribLocation(this.program, "aTexCoord")
		this.uImageLocation = gl.getUniformLocation(this.program, "uImage")
		this.uWorldLocation = gl.getUniformLocation(this.program, "uWorld")
		this.uObjectLocation = gl.getUniformLocation(this.program, "uObject")
		this.uFrameLocation = gl.getUniformLocation(this.program, "uFrame")
	}
}
