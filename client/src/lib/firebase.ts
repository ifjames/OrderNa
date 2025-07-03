import { initializeApp, getApps, getApp } from "firebase/app";
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDSYNG7pAGLTFhYC6fSsrc3CFxmrf_0dME",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ordernaub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ordernaub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ordernaub.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "348579273140",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:348579273140:web:63c1fc5f21789cb392fae1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
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
    loyaltyPoints: 0,
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
    loyaltyPoints: 0,
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
  try {
    const menuCollection = collection(db, 'menuItems');
    const menuQuery = query(menuCollection, where('available', '==', true));
    const menuSnapshot = await getDocs(menuQuery);
    return menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Return sample data if Firestore fails
    return [
      {
        id: '1',
        name: 'Adobo Rice Bowl',
        description: 'Tender pork adobo served with steamed rice and vegetables',
        price: 85,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        available: true,
        canteenId: 'main-canteen',
        rating: '4.8',
        createdAt: new Date(),
        stock: 25
      },
      {
        id: '2',
        name: 'Pancit Canton',
        description: 'Stir-fried noodles with mixed vegetables and meat',
        price: 75,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        available: true,
        canteenId: 'main-canteen',
        rating: '4.6',
        createdAt: new Date(),
        stock: 18
      },
      {
        id: '3',
        name: 'Fresh Lumpia',
        description: 'Fresh spring rolls with lettuce and peanut sauce',
        price: 45,
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d22a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        available: false,
        canteenId: 'main-canteen',
        rating: '4.7',
        createdAt: new Date(),
        stock: 0
      },
      {
        id: '4',
        name: 'Mango Shake',
        description: 'Fresh mango blended with ice and milk',
        price: 55,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        available: true,
        canteenId: 'main-canteen',
        rating: '4.9',
        createdAt: new Date(),
        stock: 12
      }
    ];
  }
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

// Delivery functionality
export const createDeliveryOrder = async (orderData: any) => {
  const deliveryOrderRef = await addDoc(collection(db, 'deliveryOrders'), {
    ...orderData,
    deliveryStatus: 'pending', // pending, assigned, picked_up, delivered
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return { id: deliveryOrderRef.id, ...orderData };
};

export const updateDeliveryStatus = async (deliveryOrderId: string, status: string) => {
  const deliveryOrderRef = doc(db, 'deliveryOrders', deliveryOrderId);
  await updateDoc(deliveryOrderRef, {
    deliveryStatus: status,
    updatedAt: Timestamp.now(),
  });
};

export const getDeliveryOrders = async () => {
  const deliveryCollection = collection(db, 'deliveryOrders');
  const deliveryQuery = query(deliveryCollection, orderBy('createdAt', 'desc'));
  const deliverySnapshot = await getDocs(deliveryQuery);
  return deliverySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Loyalty Points System
export const updateUserLoyaltyPoints = async (userId: string, points: number) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentPoints = userSnap.data().loyaltyPoints || 0;
    await updateDoc(userRef, {
      loyaltyPoints: currentPoints + points,
      updatedAt: Timestamp.now(),
    });
  }
};

export const getUserLoyaltyPoints = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().loyaltyPoints || 0 : 0;
};

// Favorites System
export const addToFavorites = async (userId: string, menuItemId: string) => {
  const favoriteRef = await addDoc(collection(db, 'favorites'), {
    userId,
    menuItemId,
    createdAt: Timestamp.now(),
  });
  return favoriteRef.id;
};

export const removeFromFavorites = async (favoriteId: string) => {
  const favoriteRef = doc(db, 'favorites', favoriteId);
  await deleteDoc(favoriteRef);
};

export const getUserFavorites = async (userId: string) => {
  const favoritesCollection = collection(db, 'favorites');
  const favoritesQuery = query(favoritesCollection, where('userId', '==', userId));
  const favoritesSnapshot = await getDocs(favoritesQuery);
  return favoritesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Reviews and Ratings
export const addReview = async (reviewData: {
  userId: string;
  menuItemId: string;
  rating: number;
  comment: string;
}) => {
  const reviewRef = await addDoc(collection(db, 'reviews'), {
    ...reviewData,
    createdAt: Timestamp.now(),
  });
  return reviewRef.id;
};

export const getMenuItemReviews = async (menuItemId: string) => {
  const reviewsCollection = collection(db, 'reviews');
  const reviewsQuery = query(reviewsCollection, where('menuItemId', '==', menuItemId), orderBy('createdAt', 'desc'));
  const reviewsSnapshot = await getDocs(reviewsQuery);
  return reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Notifications
export const createNotification = async (notificationData: {
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
}) => {
  const notificationRef = await addDoc(collection(db, 'notifications'), {
    ...notificationData,
    read: false,
    createdAt: Timestamp.now(),
  });
  return notificationRef.id;
};

export const getUserNotifications = async (userId: string) => {
  const notificationsCollection = collection(db, 'notifications');
  const notificationsQuery = query(
    notificationsCollection, 
    where('userId', '==', userId), 
    orderBy('createdAt', 'desc')
  );
  const notificationsSnapshot = await getDocs(notificationsQuery);
  return notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, {
    read: true,
    updatedAt: Timestamp.now(),
  });
};

// Sample data initialization
export const initializeSampleData = async () => {
  const menuItems = [
    // Main Canteen - Filipino Traditional Food
    {
      name: 'Adobo Rice Bowl',
      description: 'Tender pork adobo served with steamed rice, vegetables, and our signature sauce',
      price: '85',
      category: 'main',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.8',
      stock: 25,
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
      stock: 30,
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
      stock: 18,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Kare-Kare',
      description: 'Traditional Filipino stew with oxtail, vegetables in rich peanut sauce',
      price: '120',
      category: 'main',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.7',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Lechon Kawali',
      description: 'Crispy fried pork belly served with rice and spicy vinegar dip',
      price: '110',
      category: 'main',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.8',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Tinola',
      description: 'Clear chicken soup with ginger, green papaya, and chili leaves',
      price: '90',
      category: 'soup',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.5',
      stock: 22,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Fresh Lumpia',
      description: 'Fresh spring rolls with lettuce, carrots, and sweet peanut sauce',
      price: '45',
      category: 'snacks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.7',
      stock: 35,
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
      stock: 40,
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Buko Juice',
      description: 'Fresh young coconut water served in the shell with tender coconut meat',
      price: '45',
      category: 'drinks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.6',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Sago at Gulaman',
      description: 'Sweet refreshing drink with sago pearls and gelatin strips',
      price: '30',
      category: 'drinks',
      available: true,
      canteenId: 'main-canteen',
      rating: '4.4',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
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