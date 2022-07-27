export default class StartestError extends Error {
  constructor(message) {
    super(message);
    console.error(message);
    this.name = '[Startest Error]';
  }
}
