const Config = {
    development: {
        server_websocket: "ws://localhost:1337",
        server_mirth: "http://localhost:8022/analyzer/"
    },
    heitech647: {
        server_websocket: "ws://localhost:1337",
        server_mirth: "http://172.19.64.7:8022/analyzer/"
    },
    production: {
        server_websocket: "ws://10.11.140.10:1337",
        server_mirth: "http://10.11.140.10:8022/analyzer/"
    },
    production17: {
        server_websocket: "ws://10.11.147.72:1337",
        server_mirth: "http://10.11.147.72:8022/analyzer/"
    },
    production17Server: {
        server_websocket: "ws://10.11.128.153:1337",
        server_mirth: "http://10.11.128.153:8022/analyzer/"
    }
}

export default Config.production17Server