# 🇦🇺 Australian Citizenship Quiz App
This is a simple quiz app designed to help prepare for the Australian citizenship test. It features a Go backend and a Next.js frontend, with a total of 350 questions covering key topics from the [official test](https://immi.homeaffairs.gov.au/citizenship-subsite/files/our-common-bond-testable.pdf).

## 🛠️ Tech Stack
- Backend: Go (Golang)
- Frontend: Next.js (React) with Material UI

## Run with Docker
Make sure docker is installed and running
```
make up
```

## 🚀 Getting Started
Clone the rep
```
git clone git@github.com:samit22/aus-citizenship-test.git
```

### 1️⃣ Backend Setup
Ensure you have Go installed.

```
cd backend
make run
```
### 2️⃣ Frontend Setup
Ensure you have Node 20+ installed. Then, run:

```
cd frontend
make run
```
### 3️⃣ Accessing the App
Once both backend and frontend are running, open:
http://localhost:3000


## 📝 Customization
You can update the questions in the questions.json file inside backend
Modify the UI 

## 🎯 Why This App?
This app was built specifically for my wife as she prepares for the Australian citizenship test. If you're also studying, I hope this helps you too! 🇦🇺💙