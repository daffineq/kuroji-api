class Logger {
  log(message?: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }
}

export default new Logger();
