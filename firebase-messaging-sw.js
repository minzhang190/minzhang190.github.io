importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js');
importScripts('/firebase-messaging-redirect.js');

var firebaseConfig = {
  apiKey: "AIzaSyAitGP_5qbYuEPWXQUsaKgo0-1etrJ3-7Q",
  authDomain: "hawken-c9ef9.firebaseapp.com",
  databaseURL: "https://hawken-c9ef9.firebaseio.com",
  projectId: "hawken-c9ef9",
  storageBucket: "hawken-c9ef9.appspot.com",
  messagingSenderId: "239346842884",
  appId: "1:239346842884:web:b9430603097c18e615a451",
  measurementId: "G-NQVYEFDL6P"
};

firebase.initializeApp(firebaseConfig);
firebase.messaging();
