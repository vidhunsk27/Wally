# Wally MK 2: backend and going online

This folder already contains a working backend in `server/`. It does four jobs:

1. Serves the app (so one web address gives you both the site and its data).
2. Stores the ledger, wishlist, library, workspace and everything else, so phone and laptop share the same data.
3. Holds bank SMS that your phone posts, until the app collects them.
4. Reads product and title pages for the link scraper.

The app keeps working without it. Whenever the server is unreachable, everything is saved in the browser and merged later.

---

## Part 1: run it on your own computer (10 minutes)

1. Install Node.js 18 or newer from https://nodejs.org (the "LTS" download).
2. Open a terminal inside the `server` folder and run:

   ```
   npm install
   npm start
   ```

   You should see `Wally MK 2 server on port 3000`.
3. Open http://localhost:3000 in your browser. That is the app, served by your own backend.
4. In the app, press the shield button in the header, open **Cloud**, and press **Sync now**. The status should say Connected and your existing entries are copied to the server.

Locally the data is written to `server/data.json`. Keep that file; it is your database for now.

You can keep using Live Server (`127.0.0.1:5500`) as well. The app automatically talks to `localhost:3000` when it is opened locally.

---

## Part 2: put the code on GitHub

1. Create a free account at https://github.com and make a new **private** repository, for example `wally-mk2`.
2. Upload the whole project folder (everything next to `index.html`, including `server/` and `fitness/`).
   Do not upload `server/node_modules` or `server/data.json`. A `.gitignore` file is included that skips them.
3. If you use Git from the terminal instead:

   ```
   git init
   git add .
   git commit -m "Wally MK 2"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/wally-mk2.git
   git push -u origin main
   ```

---

## Part 3: a permanent database (Firebase Firestore)

Free hosts wipe local files whenever the server restarts, so `data.json` is not safe online. Firestore keeps the data permanently.

1. Go to https://console.firebase.google.com and create a project.
2. In the left menu open **Firestore Database** and create a database (production mode, any nearby region).
3. Open **Project settings → Service accounts → Generate new private key**. A `.json` file downloads. Treat it like a password.
4. Open that file in a text editor and copy its entire contents. You will paste it in the next part.

---

## Part 4: publish on Render

1. Create a free account at https://render.com and choose **New → Web Service**.
2. Connect your GitHub account and pick the `wally-mk2` repository.
3. Fill in:

   | Setting | Value |
   |---|---|
   | Root directory | leave empty |
   | Build command | `cd server && npm install` |
   | Start command | `node server/server.js` |
   | Instance type | Free |

4. Under **Environment variables** add:

   | Name | Value |
   |---|---|
   | `WALLY_KEY` | a long phrase only you know. This is the password for your data. |
   | `FIREBASE_SERVICE_ACCOUNT` | the full contents of the Firebase `.json` file |

5. Create the service. After a few minutes Render gives you an address like `https://wally-mk2.onrender.com`. That is your site.
6. Open it, press the shield button → **Cloud**, type your `WALLY_KEY`, press **Save key**. Do this once on each device.

Things to know about the free plan: the server sleeps after a period with no visits, and the first visit after that takes up to a minute to wake it. Your data is not affected.

Menu names on Render and Firebase change from time to time. If a label differs, look for the closest match.

---

## Part 5: use it on your phone

1. Open your Render address in Chrome on the phone.
2. Browser menu → **Add to Home screen** (or **Install app**).
3. Enter your key under shield → Cloud. The phone now shares data with the laptop.
4. Shield → Reminders → **Allow**, to get notifications.

### Automatic bank SMS

With the server online the phone no longer has to open the app. An automation app (MacroDroid, Tasker) can send each message straight to the server:

- Trigger: SMS received, containing `debited` or `credited`
- Action: HTTP request
  - Method: `POST`
  - URL: `https://YOUR-ADDRESS.onrender.com/api/sms?key=YOUR_WALLY_KEY`
  - Content type: `application/json`
  - Body: `{"text":"<the SMS text variable>"}`

The next time any of your devices opens the app, those messages are read and added to the ledger.

---

## How your data is kept safe

- **On each device:** a full copy is saved automatically once a day and before any purge, import or restore. Shield → Data vault lists them and can restore any one.
- **Backup file:** Shield → Data vault → Download full backup. Keep one somewhere outside the browser.
- **Syncing never deletes by accident:** ledger, wishlist and library are merged item by item. Something you delete on one device is removed on the others (after a safety copy), and Undo brings it back everywhere.
- **Everything else** (habits, planner, growth, fitness, notes) follows whichever device changed it last.
- **Not synced:** sketch drafts and your uploaded pictures stay on the device they were made on, because they are large.

## Server routes (for reference)

| Route | Purpose |
|---|---|
| `GET /api/health` | is the server up, which storage, is a key required |
| `GET /api/get-transactions`, `POST /api/add-transaction`, `DELETE /api/delete-transaction/:id` | ledger |
| `GET /api/get-wishlist`, `POST /api/add-wishlist`, `DELETE /api/delete-wishlist/:id` | wishlist and library |
| `GET /api/deleted`, `POST /api/undelete` | deletions shared between devices |
| `GET /api/get-workspace`, `POST /api/save-workspace` | workspace notes and sketch |
| `GET /api/state`, `PUT /api/state` | all other app data |
| `POST /api/sms`, `GET /api/sms-inbox`, `POST /api/sms-ack` | bank SMS drop-box |
| `POST /api/scrape-price`, `POST /api/scrape-media` | link scraper |
| `POST /api/jarvis-*` | AI routes. Not configured; the app uses its built-in analysis instead. |
