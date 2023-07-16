const $ = Env("测试")
main()
function main() {
    $.wait(5000)
    $.start()
    Notice()
    $.sendNotify()
    $.done()
}


function Notice() {
    let url = "https://fastly.jsdelivr.net/gh/smallfawn/Note@main/Notice.json"
    let options = {
        method: "GET",
        headers: {},
    }
    let result = $.httpRequest(url, options)
    $.DoubleLog(result.notice)
}



function Env(name) {
    const env = {};
    // 定义属性
    env.property = "value";
    // 定义方法
    env.name = name;
    env.startTime = Date.now();
    env.msg = ""
    env.DoubleLog = function (message) {
        console.log(message);
        this.msg += `\n ${message}`
    }
    env.start = function () {
        this.DoubleLog(`🔔${this.name}, 开始! 🕛`)
    }
    env.httpRequest = function (url, options) {
        return HTTP.fetch(url, options).json();
    }
    env.sendNotify = function () {
        let body = {
            token: "",
            title: "来自airScript的消息通知",
            content: this.msg,
            topic: "",
        };
        let url = "https://www.pushplus.plus/send"
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        }
        let result = this.httpRequest(url, options)
        console.log(result);
    }

    env.timestamp = function () {
        return Date.now();
    }
    env.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    env.MD5 = function (data) {
        return Crypto.createHash("md5").update(data).digest("hex")
    }
    env.SHA1 = function (data) {
        return Crypto.createHash("sha1").update(data).digest("hex")
    }
    env.SHA256 = function (data) {
        return Crypto.createHash("sha256").update(data).digest("hex")
    }
    env.HAMCMD5 = function (data, key) {
        return Crypto.createHmac("md5", key).update(data).digest('hex')
    }
    env.HAMCSHA1 = function (data, key) {
        return Crypto.createHmac("sha256", key).update(data).digest('hex')
    }
    env.HAMCSHA256 = function (data, key) {
        return Crypto.createHmac("sha256", key).update(data).digest('hex')
    }
    env.wait = function (time) {
        return Time.sleep(time) // 休眠一秒
    }
    env.done = function () {
        const endTime = Date.now();
        const costTime = (endTime - this.startTime) / 1000;
        this.DoubleLog(`🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
    }
    return env;
}
