module.exports = class MessageQueue {
    constructor(json){
        this.topic = json.topic;
        this.data = json.data;
        this.created_at = +new Date();
    }
}
