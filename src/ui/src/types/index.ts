/* eslint-disable no-unused-vars */
enum Context {
	ContentScript,
	Options,
}

enum BuildTargets {
	Options = './apps/Options',
	ContentScript = './apps/ContentScript',
}

export { Context, BuildTargets };
/* eslint-enable no-unused-vars */
