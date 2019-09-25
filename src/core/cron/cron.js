import cron from "node-cron";

export default () => {
  
  cron.schedule('0 * * * *', () => { // Every hour
    console.log('Running Cron Task - Something in every hour');
    // Your function
  });
}


