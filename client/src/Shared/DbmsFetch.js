const send = fetch

export default class DbmsFetch {
    constructor({ip, port}, userInfo) {
        this.ip = ip
        this.port = port
        this.userInfo = userInfo
    }

    createPayload = (operation, name, data) => {
        const payload = {
            operation: operation,
            data: {
                login: this.userInfo.login,
                password: this.userInfo.password,
                'account-type': this.userInfo['account-type']
            }
        }
        if(name) {
            payload.data[name] = data
        }

        return payload
    }

    fetch = (operation, name, data) => {
        return (
            send(`http://${this.ip}:${this.port}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'text/plain',
                'Accept': 'application/json'
                },
                body: JSON.stringify(this.createPayload(operation, name, data))
            })
            .then(res => res.json())
        )
    }

    
}