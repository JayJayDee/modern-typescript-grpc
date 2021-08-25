# modern-typescript-grpc-example
This example can help you in the following cases: 
- Typing using typescript + node.js when developing gRPC server
- Binary (image/video) streaming with gRPC 
- gRPC client example in python 

# How to run
## typescript-server
```bash
cd $PROJECT_ROOT/typescript-server
npm install 
npm start
```

## python-client
```bash
cd $PROJECT_ROOT/python-client
python3 -m venv .
source bin/activate
pip3 install -r requirements.txt
python3 ping_client.py # or useless_client.py
```

