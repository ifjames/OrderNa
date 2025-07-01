import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignIn
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "orderna-demo"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "orderna-demo",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "orderna-demo"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithRedirect(auth, provider);
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Email/Password Authentication
export const createUserWithEmailAndPassword = async (userData: {
  email: string;
  password: string;
  name: string;
  studentId: string;
  phoneNumber: string;
  role?: 'student' | 'staff' | 'admin';
}) => {
  const userCredential = await firebaseCreateUser(auth, userData.email, userData.password);
  const user = userCredential.user;
  
  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    firebaseUid: user.uid,
    email: userData.email,
    name: userData.name,
    role: userData.role || 'student',
    studentId: userData.studentId,
    phoneNumber: userData.phoneNumber,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return userCredential;
};

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  return firebaseSignIn(auth, email, password);
};

// Firestore helpers
export const createUser = async (userData: any) => {
  const userRef = doc(db, 'users', userData.firebaseUid);
  await setDoc(userRef, {
    ...userData,
    createdAt: Timestamp.now(),
  });
  return userData;
};

export const getUser = async (firebaseUid: string) => {
  const userRef = doc(db, 'users', firebaseUid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
};

export const getMenuItems = async () => {
  const menuCollection = collection(db, 'menuItems');
  const menuQuery = query(menuCollection, where('available', '==', true), orderBy('category'), orderBy('name'));
  const menuSnapshot = await getDocs(menuQuery);
  return menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createOrder = async (orderData: any) => {
  const orderRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return { id: orderRef.id, ...orderData };
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.now(),
  });
};

export const getUserOrders = async (userId: string) => {
  const ordersCollection = collection(db, 'orders');
  const ordersQuery = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const ordersSnapshot = await getDocs(ordersQuery);
  return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToOrders = (callback: (orders: any[]) => void, filters?: any) => {
  const ordersCollection = collection(db, 'orders');
  let ordersQuery = query(ordersCollection, orderBy('createdAt', 'desc'));
  
  if (filters?.status) {
    ordersQuery = query(ordersCollection, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
  }
  
  return onSnapshot(ordersQuery, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
};

export const subscribeToOrder = (orderId: string, callback: (order: any) => void) => {
  const orderRef = doc(db, 'orders', orderId);
  return onSnapshot(orderRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

// Sample data initialization
export const initializeSampleData = async () => {
  const menuItems = [
    {
      name: 'Adobo Rice Bowl',
      description: 'Tender pork adobo served with steamed rice, vegetables, and our signature sauce',
      price: '85',
      category: 'main',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Pancit Canton',
      description: 'Stir-fried noodles with mixed vegetables, chicken, and shrimp in savory sauce',
      price: '75',
      category: 'main',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.6',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Sisig Rice',
      description: 'Crispy pork sisig with onions and peppers served over garlic rice',
      price: '95',
      category: 'main',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Fresh Lumpia',
      description: 'Fresh spring rolls with lettuce, carrots, and sweet peanut sauce',
      price: '45',
      category: 'snacks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.7',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d22a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Turon',
      description: 'Golden fried banana and jackfruit spring rolls with brown sugar',
      price: '35',
      category: 'snacks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.5',
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Empanada',
      description: 'Crispy pastry filled with ground pork, vegetables, and hard-boiled egg',
      price: '40',
      category: 'snacks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.4',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Mango Shake',
      description: 'Fresh mango blended with ice and milk, topped with whipped cream',
      price: '55',
      category: 'drinks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Buko Juice',
      description: 'Fresh young coconut water served in the shell with tender coconut meat',
      price: '45',
      category: 'drinks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.6',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Iced Coffee',
      description: 'Bold Filipino coffee served over ice with condensed milk',
      price: '35',
      category: 'drinks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.3',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    }
  ];

  try {
    const batch = [];
    for (const item of menuItems) {
      const docRef = await addDoc(collection(db, 'menuItems'), {
        ...item,
        createdAt: Timestamp.now(),
      });
      batch.push(docRef);
    }
    console.log('Sample menu items added successfully');
    return batch;
  } catch (error) {
    console.error('Error adding sample data:', error);
    throw error;
  }
};
