Make sure to have MongoDB installed, Node.js, and MongoDB Compass for GUI.

1. Navigate to the server folder in terminal ( cd server )

2. npm install

3. npm start

4. make a .env file with: 

MONGO_URI=mongodb://localhost:27017/restaurant
JWT_SECRET=alosdfyh9h13fjalkds
PORT=5000

5. npm start

FOR MongoDB Compass:

Open the app, then paste this link in the connection box: 

mongodb://localhost:27017

To access the appplication:
1. Navigate to the client folder in another terminal window (cd server)

2. npm install

3. npm run dev

4. Navigate to http://localhost:5173/admin in a web browser.

The collections for mongodb are: menuItems, users, orders, reservations, tables.
