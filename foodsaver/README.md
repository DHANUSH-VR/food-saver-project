# 🍱 Food Saver — Food Saver

A web app to connect food donors with NGOs and delivery agents.

---

## 🚀 How to Set Up (Step by Step)

### Step 1 — Install requirements
- [Node.js](https://nodejs.org) (download LTS version)
- [MySQL](https://dev.mysql.com/downloads/mysql/) + MySQL Workbench

### Step 2 — Set up the database
1. Open **MySQL Workbench**
2. Connect to your local server
3. Open the file `database.sql` from this project
4. Click the ⚡ Run button to execute it
5. You should see a `foodsaver` database created!

### Step 3 — Configure your password
1. Open the `.env` file
2. Replace `your_mysql_password_here` with your actual MySQL password
3. Save the file

### Step 4 — Install packages
Open a terminal in this project folder and run:
```
npm install
```

### Step 5 — Start the server
```
npm start
```
You should see:
```
✅ Connected to MySQL!
🚀 Server running at http://localhost:3000
```

### Step 6 — Open the app
Just open `index.html` in your browser. That's it!

---

## 📁 Project Structure

```
food-saver/
├── server.js           ← Backend server (Node.js + Express)
├── database.sql        ← Run this in MySQL Workbench first!
├── package.json        ← Project info and dependencies
├── .env                ← Your database password (NOT on GitHub)
├── .gitignore          ← Tells Git to ignore .env and node_modules
├── index.html          ← Homepage
├── user-signup.html    ← User login/register
├── donate.html     ← Submit a food donation
├── profile.html        ← Check donation status
├── admin-login.html    ← Admin login
├── admin-dashboard.html← Admin panel
├── delivery-login.html ← Delivery agent login
├── delivery-register.html ← Delivery agent register
├── about.html          ← About page
├── contact.html        ← Contact page
└── d-ngo.html      ← NGO partner page
```

---

## 🔌 API Endpoints

| Method | URL | What it does |
|--------|-----|--------------|
| POST | /api/signup | Register a new user |
| POST | /api/login | Login as user |
| POST | /api/donate | Submit a food donation |
| GET  | /api/donation/:id | Check donation status |
| POST | /api/admin/login | Admin login |
| GET  | /api/admin/donations | Get all donations (admin) |
| PUT  | /api/admin/donation/:id | Update donation status |
| POST | /api/delivery/signup | Register delivery agent |
| POST | /api/delivery/login | Login as delivery agent |
| GET  | /api/delivery/pending | Get pending donations |
| POST | /api/contact | Send a contact message |

---

## ⚠️ Important Notes

- Never share your `.env` file — it contains your database password
- The `.gitignore` file makes sure `.env` is NOT uploaded to GitHub
- Default admin login: username `admin`, password `admin123` (change this!)
