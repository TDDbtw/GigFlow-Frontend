
---

# 🚀 GigFlow Client (Local Setup)

A React frontend application for the **(GigFlow)** platform.

Built with:

* **Vite** – Fast build tool
* **React** – UI library
* **Redux Toolkit** – State management
* **Tailwind CSS** – Styling

---

## 📦 Prerequisites

Make sure you have installed:

* **Node.js** (v18+ recommended)
* **npm**
* **GigFlow Server running locally**

Backend should be running at:

```
http://localhost:5000
```

---

## ⚙️ Local Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/gigflow-client.git
cd gigflow-client
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

✅ Notes:

* This must match your locally running backend.
* Restart the dev server after changing `.env`.

---

### 4️⃣ Run the app locally

```bash
npm run dev
```

The app will start at:

```
http://localhost:5173
```

---

## 🔗 Backend Connection

Make sure your backend `.env` has:

```env
CLIENT_URL=http://localhost:5173
```

And CORS + cookies are enabled.

---

## ⚠️ Important Local Configuration

### ✅ API calls

All API requests should use:

```js
import.meta.env.VITE_API_URL
```

Example:

```js
axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
```

---

### ✅ Cookies & Auth

Since frontend and backend are on different ports:

Backend cookie options should include:

* `secure: false`
* `sameSite: "none"`
* `httpOnly: true`

---

## 🧪 Testing Locally

Run both servers:

Terminal 1 (backend):

```bash
npm run dev
```

Terminal 2 (frontend):

```bash
npm run dev
```

Then open:

```
http://localhost:5173
```

---

