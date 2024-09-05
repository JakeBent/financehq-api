import 'dotenv/config';

class Config {
  static shared: Config = new Config();

  public port = process.env.PORT ?? 3000;

  public helmet = {
    contentSecurityPolicy: {
      directives: {
        'style-src': ["'self'", 'unpkg.com'],
        'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
        'img-src': ["'self'", 'raw.githubusercontent.com'],
      },
    },
  };

  public salt = 10;
}

export default Config.shared;
