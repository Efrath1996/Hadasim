export function welcomeEmail(user) {
  return {
    subject: 'Welcome to Grocery Orders!',
    html: `<p>Hi ${user.contactName} from ${user.companyName},</p>
           <p>Thanks for registering!</p>
           <p>You can now receive and approve orders easily via our system: <a href="http://localhost:3000/" target="_blank">Grocery Orders</a>.</p>`,
  };
}
