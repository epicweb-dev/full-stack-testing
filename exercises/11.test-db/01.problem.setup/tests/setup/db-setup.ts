// 🐨 create a databaseFile variable that points to `./tests/prisma/data.db`
// 🐨 create a full path to that file with path.join(process.cwd(), databaseFile)
// 🐨 set process.env.DATABASE_URL to that full path

// 🐨 before all the tests run, use execaCommand from 'execa' to run:
//   prisma migrate reset --force --skip-seed --skip-generate

// 🐨 after each test, dynamically import prisma from #app/utils/db.server.ts and
// delete all the users from the database
// 💰 we dynamically import prisma so it's not loaded before the environment
// variable is set: await import('#app/utils/db.server.ts')

// 🐨 after all the tests are finished, dynamically import prisma again and
// call prisma.$disconnect(), then delete the databaseFile with fsExtra.remove
