
export default class DBUIWebComponentMessage {
  constructor({
    channel, message, data, source, rememberNodesPath,
    domType, targetType, metadata
  }) {
    this._channel = channel;
    this._message = message;
    this._data = data;
    this._source = source; // instance of node creating the message
    this._rememberNodesPath = rememberNodesPath;
    this._domType = domType; // LIGHT_DOM_TYPE || SHADOW_DOM_TYPE
    this._targetType = targetType; // PARENT_TARGET_TYPE || CHILDREN_TARGET_TYPE
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
      domType: this.domType,
      targetType: this.targetType,
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

  get domType() {
    return this._domType;
  }

  get targetType() {
    return this._targetType;
  }

  get metadata() {
    return this._metadata;
  }

  get visitedNodes() {
    return [...this._visitedNodes];
  }

}

