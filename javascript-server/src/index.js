const { loadSync } = require('@grpc/proto-loader');
const { loadPackageDefinition, Server, ServerCredentials } = require('@grpc/grpc-js');
const { join } = require('path');
const { makeUselessImageStream } = require('./useless-things-maker');

const getProtoFilePath = () => join(
	__dirname,
	'../../typescript-server/protos/example.proto',
);

(async () => {
	const packageDefinition = loadSync(getProtoFilePath(), {
		keepCase: true
	});

	const examplePackage =
		loadPackageDefinition(packageDefinition).example_knowre_package;

	const serviceImplementation = {
		ping(call, callback) {
			const { pingMessage } = call.request;
			const pongMessage = `${pingMessage} from js-server`;
			console.log(`message arrival: ${pingMessage}`);
			callback(null, { pongMessage });
		},

		requestUselessImage(call) {
			const { seed } = call.request;
			const textImageStream = makeUselessImageStream(seed);
			textImageStream.on('data', chunk => {
				console.log(`request arrival (uselessImage): ${seed}, imageChunk: ${chunk.length}`);
				call.write({ imageBytes: chunk, seed });
			});
			textImageStream.on('end', () => {
				console.log(`image stream done (uselessImage): ${seed}`);
				call.end()
			});
		}
	};

	const server = new Server();
	server.addService(
		examplePackage.UselessService.service,
		serviceImplementation
	);
	server.bindAsync('0.0.0.0:50051',
		ServerCredentials.createInsecure(),
		(err, port) => {
			if (err) {
				return console.error(err);
			}
			console.log(`gRPC server (js) started in port: ${port}`);
			server.start(port);
		}
	);
})();
