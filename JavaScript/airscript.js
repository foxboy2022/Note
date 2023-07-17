const $ = Env("测试")
//输入你变量所在的表格位置
let range = "A1"

let userList
function task(i) {
    let index = userList.indexOf(i);
    $.DoubleLog(`------ 开始第${index + 1}个账号 ------`)
    if (i.indexOf("&") !== -1) {
        let arr = i.split("&");
        $.DoubleLog(`账号的参数${arr[0]}`)
        $.DoubleLog(`账号的参数${arr[1]}`)
    } else {
        $.DoubleLog(`账号的参数${i}`)
    }
    //初始化变量
    let token = ""
    //执行代码
    //任务1
    apipost(i)//测试
    //任务2
    //任务3
}

function apipost() {
    let url = "https://echo.apipost.cn/get.php"
    let options = {
        method: "GET",
        headers: {},
    }
    let result = $.httpRequest(url, options)
    $.DoubleLog(result)
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

main()
function main() {
    $.wait(5000)
    $.start()
    Notice()
    userList = $.checkEnv()
    userList = Array.isArray(userList) ? userList.forEach(task) : task(userList)
    /*if (Array.isArray(userList)) {
        for (let i of userList) {
            task(i)
        }
    } else {
        task(userList)
    }*/
    $.sendNotify()
    $.done()
}


// Env for wps AirScript(JavaScript)
// @time 2023-7-16
// update: new getDate & setDate
// @Author: smallfawn 
// @Github: https://github.com/smallfawn 
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
    env.checkEnv = function () {
        let userCookie = $.getData(range) !== "" ? $.getData(range) : "";
        if (userCookie && userCookie.indexOf("@") !== -1) {
            return userCookie.split("@");
        } else if (userCookie) {
            return userCookie;
        } else {
            console.log("环境变量为空");
            return [];
        }
    };
    //比如A1 那么就输出A1表格的内容
    env.getData = function (Range) {
        return Application.Range(Range).Text
    }
    env.setDate = function (Range, Value) {
        return Application.Range(Range).Value = Value
    }
    env.httpRequest = function (url, options) {
        /*使用HTTP服务时，禁止使用IP地址发起请求，禁止使用端口发起请求。
        使用HTTP服务时，收到内容的消息体最大为2M，超过2M会抛出错误。*/
        let resp = HTTP.fetch(url, options).text();
        try { resp = JSON.parse(resp) } catch (error) { }
        return resp
    }
    env.sendNotify = function () {
        let body = {
            token: "",
            title: "来自airScript的消息通知",
            content: this.msg,
            topic: "",
        };
        if (!body.token) {
            return console.log("PushPlus token为空")
        }
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
    /**
     * Hash加密 允许"md5", "sha1", "sha", "sha256", "sha512"
     * @param {*} algorithm 加密方法
     * @param {*} data 加密参数
     * @param {*} returnType 返回类型 默认hex
     * @returns 
     */
    env.HashEncrypt = function (algorithm, data, returnType = "hex") {
        return Crypto.createHash(algorithm).update(data).digest(returnType)
    }
    /**
     * Hmac加密 允许"md5", "sha1", "sha", "sha256", "sha512"
     * @param {*} algorithm 加密方法
     * @param {*} data 加密参数
     * @param {*} key 加密密钥
     * @param {*} returnType 返回类型 默认hex
     * @returns 
     */
    env.HmacEncrypt = function (algorithm, data, key, returnType = "hex") {
        return Crypto.createHmac(algorithm, key).update(data).digest(returnType)
    }
    env.wait = function (time) {
        return Time.sleep(time)
    }
    env.done = function () {
        const endTime = Date.now();
        const costTime = (endTime - this.startTime) / 1000;
        this.DoubleLog(`🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
    }
    return env;
}
