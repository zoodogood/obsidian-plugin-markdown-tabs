import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import EventsEmitter from "events";

interface IContext {
	exitData: { resolve: any; reject: any };
	promise: Promise<any>;
	child: ChildProcessWithoutNullStreams;
	emitter: EventsEmitter;
	outString: string;
}

interface IParams {
	root: string;
	logger?: boolean;
}

export default ({ root, logger = false }: IParams) => {
	// Solve problem: https://stackoverflow.com/questions/43230346/error-spawn-npm-enoent
	const _npm = process.platform === "win32" ? "npm.cmd" : "npm";

	const EventsCallbacks = [
		{
			key: "stdoutError",
			callback({ exitData }: IContext, error: Error) {
				logger && info(`Error: ${error.message}`);
				exitData.reject(error);
			},
		},

		{
			key: "stderrError",
			callback({ exitData }: IContext, error: Error) {
				logger && info(`Error: ${error.message}`);
				exitData.reject(error);
			},
		},

		{
			key: "stdoutData",
			callback(context: IContext, data: any) {
				const content = String(data);
				context.emitter.emit("data", content);
				context.outString = context.outString.concat(content);
				logger && console.info(content);
			},
		},

		{
			key: "stderrData",
			callback(context: IContext, data: any) {
				const content = String(data);
				context.emitter.emit("data", content);
				context.outString = context.outString.concat(content);
				logger && console.info(content);
			},
		},

		{
			key: "message",
			callback(_context: IContext, data: any) {
				logger && console.info(data.toString());
			},
		},
		{
			key: "exit",
			callback({ exitData, outString }: IContext) {
				exitData.resolve(outString);
			},
		},
		{
			key: "error",
			callback({ exitData }: IContext, error: Error) {
				logger && info(`Error: ${error.message}`);
				exitData.reject(error);
			},
		},
	];

	const info = async (string: string) =>
		console.info(`\x1b[1m${string}\x1b[22m`);

	const run = async (command: string, params: string[]) => {
		const child = spawn(command, params, { cwd: root });
		const exitData = { resolve: null, reject: null };

		const promise = new Promise((resolve, reject) =>
			Object.assign(exitData, { resolve, reject })
		);

		const emitter = new EventsEmitter();
		const outString = "";

		const events = Object.fromEntries(
			EventsCallbacks.map(({ callback, key }) => [
				key,
				callback.bind(null, {
					exitData,
					promise,
					child,
					emitter,
					outString,
				}),
			])
		);

		(() => {
			child.stdout.on("error", events.stdoutError);
			child.stderr.on("error", events.stderrError);
			child.stdout.on("data", events.stdoutData);
			child.stderr.on("data", events.stderrData);
			child.on("error", events.error);
			child.on("message", events.message);
			child.on("exitData", events.exitData);
		})();

		promise.finally(() => {
			child.stdout.removeListener("error", events.stdoutError);
			child.stderr.removeListener("error", events.stderrError);
			child.stdout.removeListener("data", events.stdoutData);
			child.stderr.removeListener("data", events.stderrData);
			child.removeListener("error", events.error);
			child.removeListener("message", events.message);
			child.removeListener("exitData", events.exitData);
		});

		return promise;
	};

	return { run, info, _npm };
};
