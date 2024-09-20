// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCe4Hdtn8jp3JorGAZi2UNVGRh1dAu3okM",
    authDomain: "hackathon-2024-5757b.firebaseapp.com",
    projectId: "hackathon-2024-5757b",
    storageBucket: "hackathon-2024-5757b.appspot.com",
    messagingSenderId: "201371747912",
    appId: "1:201371747912:web:dee73c91be4c4294c7fa7d"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

// Login function
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Check user type and navigate
      const user = userCredential.user;
      const userTypeRef = ref(db, 'users/' + user.uid + '/userType');
      get(userTypeRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userType = snapshot.val();
          if (userType === "Student") {
            document.getElementById("login-screen").classList.add("hidden");
            document.getElementById("student-portal").classList.remove("hidden");
          } else {
            document.getElementById("login-screen").classList.add("hidden");
            document.getElementById("admin-portal").classList.remove("hidden");
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error signing in", error);
    });
}

// Add student
function addStudent() {
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const cnic = document.getElementById('cnic').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      set(ref(db, 'users/' + userId), {
        firstName,
        lastName,
        email,
        cnic,
        userType: "Student"
      });
      alert('Student added successfully!');
    })
    .catch((error) => {
      console.error("Error adding student", error);
    });
}

// Upload marks
function uploadMarks() {
  const course = document.getElementById('course').value;
  const studentId = document.getElementById('student-id').value;
  const marks = document.getElementById('marks').value;
  const totalMarks = document.getElementById('total-marks').value;

  set(ref(db, 'marks/' + studentId + '/' + course), {
    marks,
    totalMarks
  });
  alert('Marks uploaded successfully!');
}

// Update profile (for students)
function updateProfile() {
  const firstName = document.getElementById('edit-first-name').value;
  const lastName = document.getElementById('edit-last-name').value;
  const cnic = document.getElementById('edit-cnic').value;

  const user = auth.currentUser;
  update(ref(db, 'users/' + user.uid), {
    firstName,
    lastName,
    cnic
  });
  alert('Profile updated successfully!');
}

// View result (for students)
function viewResult() {
  const cnic = document.getElementById('result-cnic').value;
  const user = auth.currentUser;

  get(ref(db, 'marks/' + user.uid)).then((snapshot) => {
    if (snapshot.exists()) {
      const result = snapshot.val();
      document.getElementById('result-display').innerHTML = JSON.stringify(result);
    } else {
      alert('No result found.');
    }
  });
}
