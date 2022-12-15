export const config = {
  db: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Mohamed14',
    database: 'music-land',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
};
