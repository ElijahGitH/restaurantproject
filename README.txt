Make sure to have MongoDB installed, Node.js, and MongoDB Compass for GUI.

1. Navigate to the server folder, right click the folder, and open a terminal.

2. make a .env file in the server folder with: 

MONGO_URI=mongodb://localhost:27017/restaurant
JWT_SECRET=alosdfyh9h13fjalkds
PORT=5000

3. In terminal: npm install

4. npm start

FOR MongoDB Compass:

Open the app, then paste this link in the connection box: 

mongodb://localhost:27017

To access the appplication:
1. Navigate to the client folder and open another terminal window.

2. npm install

3. npm run dev

4. Navigate to the link that pops up in the terminal in a web browser. Will look like: http://localhost:5173/

The collections for mongodb are: menuItems, users, orders, reservations, tables.

The login for the admin user is:
username: admin
password: CasaDelSol123
