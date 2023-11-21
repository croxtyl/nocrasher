const { EventEmitter } = require('events');
const colors = require('colors');
const axios = require('axios');

class NoCrasher extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;

    this.checkOptions();

    if (this.options.enableNoCrasher) {
      this.setupEventListeners();
      console.log('[nocrasher] : [nocrasher] is now preventing crashes.'.green);
    } else {
      console.log('[nocrasher] : Option enableNoCrasher is disabled, and [nocrasher] will not be preventing bot termination'.red);
    }

    if (this.options.enableWebhook) {
      this.setupWebhook();
    }
  }

  checkOptions() {
    if (!this.options || typeof this.options.enableNoCrasher !== 'boolean') {
      console.error('[nocrasher] : Option enableNoCrasher is missing or has an invalid value! Check the documentation.'.red);
    }

    if (this.options.enableWebhook) {
      if (typeof this.options.enableWebhook !== 'boolean') {
        console.error('[nocrasher] : Option enableWebhook must be a boolean! Check the documentation.'.red);
      } else if (typeof this.options.webhookURL !== 'string') {
        console.error('[nocrasher] : Option webhookURL must be a string when enableWebhook is true! Check the documentation.'.red);
      }
    }
  }

  setupEventListeners() {
    process.on('unhandledRejection', (reason, p) => {
      this.logError('Unhandled Rejection/Catch', reason, p);
    });
    process.on('uncaughtException', (err, origin) => {
      this.logError('Uncaught Exception/Catch', err, origin);
    });
    process.on('uncaughtExceptionMonitor', (err, origin) => {
      this.logError('Uncaught Exception/Catch (Monitor)', err, origin);
    });
    process.on('multipleResolves', (type, promise, reason) => {
      //this.logError('Multiple Resolves', type, promise, reason);
    });
  }

  setupWebhook() {
    if (typeof this.options.webhookURL === 'string') {
      this.webhookURL = this.options.webhookURL;
    } else {
      console.error('[nocrasher] : Option webhookURL must be provided as a string when enableWebhook is true! Check the documentation.'.red);
    }
  }

  logError(type, ...args) {
    console.error(`[nocrasher] : ${type}`.red);
    console.error(...args);

    if (this.options.enableWebhook && this.webhookURL) {
      this.sendToWebhook(type, args);
    }
  }

  sendToWebhook(type, errors) {
    const errorMessage = errors.map(error => this.stringifyError(error)).join('\n');

    if (errorMessage.length > 4000) {
      message = message.slice(0, 4000) + '...';
    }

    const data = {
      content: `**Error Type:** ${type}\n\`\`\`${errorMessage}\`\`\``
    };

    axios.post(this.webhookURL, data)
      .catch((error) => console.error('[nocrasher] : Failed to send error to webhook.', error));
  }

  stringifyError(error) {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\n${error.stack}`;
    } else {
      return error.toString();
    }
  }
}

module.exports = NoCrasher;