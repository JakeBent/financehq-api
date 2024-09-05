import 'dotenv/config';

class Config {
  static shared: Config = new Config();

  public port = process.env.PORT;

  public helmet = {
    contentSecurityPolicy: {
      directives: {
        'style-src': ["'self'", 'unpkg.com'],
        'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
        'img-src': ["'self'", 'raw.githubusercontent.com'],
      },
    },
  };
}

export default Config.shared;
