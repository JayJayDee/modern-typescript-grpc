import grpc
from protos import example_pb2_grpc, example_pb2

if __name__ == '__main__':
	channel = grpc.insecure_channel('127.0.0.1:50051')
	stub = example_pb2_grpc.UselessServiceStub(channel)

	request = example_pb2.UselessImageReq(
		seed = 'NOODLE'
	)

	image_file = open('test.png', 'wb')
	image_length = 0

	for response in stub.requestUselessImage(request):
		image_length = image_length + len(response.imageBytes)
		image_file.write(response.imageBytes)

	print(f'file received and written, length = {image_length}')

	image_file.close()
