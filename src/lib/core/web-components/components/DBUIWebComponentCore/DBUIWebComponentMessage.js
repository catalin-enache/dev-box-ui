
export default class DBUIWebComponentMessage {
  constructor({
    channel, message, data, source, rememberNodesPath, metadata
  }) {
    this._channel = channel;
    this._message = message;
    this._data = data;
    this._source = source; // instance of node creating the message
    this._rememberNodesPath = rememberNodesPath;
    // can contain fields like targetType: children | parent or whatever else
    this._metadata = metadata;

    // internals
    this._shouldPropagate = true;
    this._visitedNodes = [];
  }

  get cloneOrInstance() {
    // The clone only makes sense if we're remembering the nodes path.
    // If we don't need that, reusing the instance should be fine.
    if (!this.rememberNodesPath) return this;
    const messageClone = new DBUIWebComponentMessage({
      channel: this.channel,
      message: this.message,
      data: this.data,
      source: this.source,
      rememberNodesPath: this.rememberNodesPath,
      metadata: this.metadata
    });
    messageClone._shouldPropagate = this.shouldPropagate;
    messageClone._visitedNodes = [...this.visitedNodes];
    return messageClone;
  }

  appendVisitedNode(node) {
    if (!this.rememberNodesPath) return;
    this._visitedNodes.push(node);
  }

  stopPropagation() {
    this._shouldPropagate = false;
  }

  get shouldPropagate() {
    return this._shouldPropagate;
  }

  get channel() {
    return this._channel;
  }

  get message() {
    return this._message;
  }

  get data() {
    return this._data;
  }

  get source() {
    return this._source;
  }

  get rememberNodesPath() {
    return this._rememberNodesPath;
  }

  get metadata() {
    return this._metadata;
  }

  get visitedNodes() {
    return [...this._visitedNodes];
  }

}

