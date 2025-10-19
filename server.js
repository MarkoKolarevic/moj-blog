const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, set } = require('firebase/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 Firebase config (ubaci svoj)
const firebaseConfig = {

  apiKey: "AIzaSyCfyRaMPlKPZTKPSyfu1fOfYfTFrpVe-zs",

  authDomain: "moj-blog-cf464.firebaseapp.com",

  databaseURL: "https://moj-blog-cf464-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "moj-blog-cf464",

  storageBucket: "moj-blog-cf464.firebasestorage.app",

  messagingSenderId: "950883932879",

  appId: "1:950883932879:web:94d4a711083412a9f0f5ba"
};

// 🔧 Init Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GET reakcija po textId
app.get('/get_counts/:textId', async (req, res) => {
  try {
    const textId = req.params.textId;
    const refPath = ref(db, `reactions/${textId}`);
    const snapshot = await get(refPath);
    const data = snapshot.exists()
      ? snapshot.val()
      : { like: 0, dislike: 0 };
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri čitanju' });
  }
});

// POST update reakcije
app.post('/update_count', async (req, res) => {
  try {
    const { textId, type } = req.body;
    const refPath = ref(db, `reactions/${textId}`);
    const snapshot = await get(refPath);
    const data = snapshot.exists()
      ? snapshot.val()
      : { like: 0, dislike: 0 };

    data[type] = (data[type] || 0) + 1;
    await set(refPath, data);

    res.json({ success: true, counts: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri upisu' });
  }
});

app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));