import grpc
from protos import example_pb2_grpc, example_pb2

if __name__ == '__main__':
	channel = grpc.insecure_channel('127.0.0.1:50051')
	stub = example_pb2_grpc.UselessServiceStub(channel)

	request = example_pb2.ClientPingReq(
		pingMessage = 'message from pythonclient'
	)
	response = stub.ping(request)

	print(response.pongMessage)
