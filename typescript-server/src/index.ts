import { sendUnaryData, Server, ServerCredentials, ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js';

import { IUselessServiceServer, UselessServiceService } from './protos/example_grpc_pb';
import { ClientPingReq, ServerPongRes, UselessImageReq, UselessImageRes } from './protos/example_pb';
import { makeUselessImageStream } from './useless-things-maker';

(async () => {
	const serverImplementation: IUselessServiceServer = {
		ping(
			call: ServerUnaryCall<ClientPingReq, ServerPongRes>,
			callback: sendUnaryData<ServerPongRes>
		) {
			const message = call.request.getPingmessage();
			const response = new ServerPongRes();
			response.setPongmessage(`${message} from server`);
			console.log(`request arrival (ping): ${message}`);
			callback(null, response);
		},

		requestUselessImage(
			call: ServerWritableStream<UselessImageReq, UselessImageRes>
		) {
			const seed = call.request.getSeed();
			const imageStream = makeUselessImageStream(seed);

			imageStream.on('data', chunk => {
				console.log(`request arrival (uselessImage): ${seed}, imageChunk: ${chunk.length}`);
				const response = new UselessImageRes();
				response.setImagebytes(chunk);
				response.setSeed(seed)
				call.write(response);
			});
			imageStream.on('end', () => {
				console.log(`image stream done (uselessImage): ${seed}`);
				call.end()
			});
		}
	};

	const server = new Server();
	server.addService(UselessServiceService, serverImplementation);
	
	server.bindAsync(
		'0.0.0.0:50051',
		ServerCredentials.createInsecure(),
		(err: Error | null, port: number) => {
			if (err) {
				return console.error(err);
			}
			server.start();
			console.log(`gRPC server started with port: ${port}`);
		}
	)
})();
