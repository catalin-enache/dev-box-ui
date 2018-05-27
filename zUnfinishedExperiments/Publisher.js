export default class Publisher {
  constructor() {
    // key: lastMessage
    this._messages = {};
    // key: [subscriber, subscriber]
    this._subscribers = {};
  }

  publish(channel, message) {
    this._messages[channel] = message;
    if (!this._subscribers[channel]) {
      return;
    }
    this._subscribers[channel].forEach(
      subscriber => subscriber.receiveMessage(message)
    );
  }

  subscribe(channel, subscriber, receiveLastMessage = true) {
    if (!this._subscribers[channel]) {
      this._subscribers[channel] = [];
    }
    this._subscribers[channel].push(subscriber);
    const currentMessage = this._messages[channel];
    receiveLastMessage &&
      currentMessage !== undefined &&
      subscriber.receiveMessage(currentMessage);
    return () => {
      // unsubscribe
      this._subscribers[channel] =
        this._subscribers[channel].filter(sub => sub !== subscriber);
    };
  }
}
