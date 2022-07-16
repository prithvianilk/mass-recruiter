import { CronJob } from 'cron';

const cron = new CronJob('1 * * * * *', () => {
  fetch('http://localhost:3000/api/2h-notify-cron');
});

cron.start();
