# RevWise 🧠💰📱

RevWise is a web application that helps you decide whether or not to buy a product by scanning it with your mobile camera and evaluating its financial impact.

---

## 🚀 Key Features

- 📷 Scan products with your mobile camera.
- 🤖 Identify products using Google Vision API.
- 💸 Estimate prices using SerpAPI.
- 📝 Manually confirm price and target purchase date.
- 💬 Chatbot-based evaluation of your purchase decision.
- ✅ Full frontend-backend integration using Next.js and FastAPI.

---

## 🧩 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, shadcn/ui.
- **Backend:** FastAPI + Google Cloud Vision API + SerpAPI.
- **Communication:** HTTP (fetch, FormData, JSON).
- **Temporary storage:** sessionStorage.

---

## 🛠️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/revwise.git
cd revwise
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Run the frontend (Next.js)

```bash
npm run dev -- --host
```

By default: [http://localhost:3000](http://localhost:3000)

---

### 4. Configure and start the backend (FastAPI)

#### Requirements:
- Python 3.10+
- `google_credentials.json` in the project root
- `.env` file with your SerpAPI key:

```
SERPAPI_KEY=your_api_key_here
```

#### Install and run:

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📱 Test on iPhone or Mobile Device

1. Ensure your iPhone and Mac are on the same Wi-Fi network.
2. Find your Mac's local IP:

```bash
ipconfig getifaddr en0
```

3. Update fetch() calls in the frontend to use the IP:

```tsx
fetch("http://192.168.1.42:8000/identify", { ... })
```

4. Open in Safari or Chrome on your phone:

```
http://192.168.1.42:3000
```

---

## 🧪 Key API Endpoints

### `POST /identify`
- Input: Image (`multipart/form-data`)
- Output:

```json
{
  "product_name": "Nike Sneakers",
  "description": "Nike Air Max, sneakers...",
  "estimated_price": 120.0,
  "price_error": null
}
```

### `POST /evaluate`
- Input: product price and user data
- Output: chatbot recommendation

---

## ✨ Credits & Libraries

- [Google Cloud Vision API](https://cloud.google.com/vision)
- [SerpAPI - Google Shopping](https://serpapi.com/)
- [shadcn/ui](https://ui.shadcn.com)
- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com)

---

## 🧠 Future Improvements

- Real banking integration (Plaid, BBVA API, etc.)
- Voice recognition
- Saved goals history
- Full chat memory and interaction tracking
