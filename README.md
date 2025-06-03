# How to clone the repository

```bash
git clone https://github.com/PhuNguyen-kun/ktpm-project.git
```

# How to run Backend (Expressjs)

**1. Go into the project directory**

```bash
cd backend
```

**2. Initialize Node.js project**

```bash
npm init -y
```

**3. Install dependencies**

```bash
npm install express dotenv express-validator
npm install --save-dev nodemon
```

**4. Create .env file**

```bash
echo PORT=3000 > .env
```

**5. Update package.json**

```bash
"scripts": {
   "dev": "nodemon src/server.js"
}
```

**6.Run development server**

```bash
npm run dev
```

# How to run Frontend (Vue3)

**1. Go into the project directory**

```bash
cd frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Development Server**

Start the development server on `http://localhost:5173`:

```bash
npm run dev
```