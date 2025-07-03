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
  apiKey: "AIzaSyDSYNG7pAGLTFhYC6fSsrc3CFxmrf_0dME",
  authDomain: "ordernaub.firebaseapp.com",
  projectId: "ordernaub",
  storageBucket: "ordernaub.firebasestorage.app",
  messagingSenderId: "348579273140",
  appId: "1:348579273140:web:63c1fc5f21789cb392fae1"
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
    },

    // Lola's Kitchen - Home-style Filipino Comfort Food  
    {
      name: 'Beef Caldereta',
      description: 'Tender beef stew with potatoes, carrots, and bell peppers in tomato sauce',
      price: '125',
      category: 'main',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.9',
      stock: 12,
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Chicken Inasal',
      description: 'Grilled chicken marinated in lemongrass and annatto, served with garlic rice',
      price: '105',
      category: 'main',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.8',
      stock: 18,
      image: 'https://images.unsplash.com/photo-1598515213692-d872bd5ce18e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Pork Menudo',
      description: 'Classic Filipino stew with pork, liver, potatoes, and tomato sauce',
      price: '95',
      category: 'main',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.6',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Bangus Sisig',
      description: 'Flaked milkfish with onions, peppers, and mayo served sizzling hot',
      price: '100',
      category: 'main',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.7',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Lumpiang Shanghai',
      description: 'Crispy fried spring rolls filled with seasoned ground pork and vegetables',
      price: '55',
      category: 'snacks',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.8',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d22a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Kwek-kwek',
      description: 'Deep-fried quail eggs coated in orange batter, served with vinegar sauce',
      price: '25',
      category: 'snacks',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.3',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Halo-halo',
      description: 'Filipino shaved ice dessert with mixed beans, fruits, and ube ice cream',
      price: '85',
      category: 'dessert',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.9',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Taho',
      description: 'Soft tofu with arnibal syrup and sago pearls - a Filipino street food favorite',
      price: '20',
      category: 'drinks',
      available: true,
      canteenId: 'lolas-kitchen',
      rating: '4.5',
      stock: 35,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },

    // Student Snack Bar - Quick Bites and Drinks
    {
      name: 'Club Sandwich',
      description: 'Triple-layered sandwich with chicken, bacon, lettuce, tomato, and mayo',
      price: '95',
      category: 'snacks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.6',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Chicken Burger',
      description: 'Juicy grilled chicken patty with lettuce, tomato, and special sauce',
      price: '85',
      category: 'snacks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.5',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Cheeseburger',
      description: 'Classic beef burger with cheese, pickles, and our signature sauce',
      price: '75',
      category: 'snacks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.4',
      stock: 28,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Hotdog Sandwich',
      description: 'Grilled hotdog with onions, pickles, and mustard in soft bread',
      price: '45',
      category: 'snacks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.2',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1612392061787-2d078b3e574b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'French Fries',
      description: 'Crispy golden fries seasoned with salt and served with ketchup',
      price: '35',
      category: 'snacks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.3',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Chicken Wings',
      description: 'Spicy buffalo wings served with ranch dressing',
      price: '65',
      category: 'snacks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.7',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon and mint',
      price: '25',
      category: 'drinks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.1',
      stock: 60,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Mango Shake',
      description: 'Fresh mango blended with ice and milk, topped with whipped cream',
      price: '55',
      category: 'drinks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.9',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Iced Coffee',
      description: 'Bold Filipino coffee served over ice with condensed milk',
      price: '35',
      category: 'drinks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.3',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Chocolate Shake',
      description: 'Rich chocolate milkshake topped with whipped cream and chocolate chips',
      price: '50',
      category: 'drinks',
      available: true,
      canteenId: 'student-snack-bar',
      rating: '4.6',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1541671274616-4c31b5216f47?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },

    // Cafe Veranda - Coffee and Light Meals
    {
      name: 'Cappuccino',
      description: 'Rich espresso with steamed milk foam and cinnamon dust',
      price: '65',
      category: 'drinks',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.8',
      stock: 35,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Americano',
      description: 'Bold espresso shots with hot water for a smooth, strong coffee',
      price: '45',
      category: 'drinks',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.5',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Cafe Latte',
      description: 'Smooth espresso with steamed milk and beautiful latte art',
      price: '70',
      category: 'drinks',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.9',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1525575454262-10206c77628e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Frappe',
      description: 'Iced coffee blend with whipped cream and caramel drizzle',
      price: '75',
      category: 'drinks',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.7',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Croissant',
      description: 'Buttery, flaky French pastry perfect for breakfast or snack',
      price: '45',
      category: 'snacks',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.4',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1555507036-ac28be2d3640?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Blueberry Muffin',
      description: 'Soft, moist muffin loaded with fresh blueberries',
      price: '55',
      category: 'snacks',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.6',
      stock: 18,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing',
      price: '85',
      category: 'main',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.5',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Chicken Panini',
      description: 'Grilled chicken breast with herbs and cheese in pressed bread',
      price: '95',
      category: 'main',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.7',
      stock: 22,
      image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Cheesecake Slice',
      description: 'Creamy New York style cheesecake with berry compote',
      price: '75',
      category: 'dessert',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.8',
      stock: 12,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Hot Chocolate',
      description: 'Rich, creamy hot chocolate topped with marshmallows',
      price: '55',
      category: 'drinks',
      available: true,
      canteenId: 'cafe-veranda',
      rating: '4.6',
      stock: 28,
      image: 'https://images.unsplash.com/photo-1541671274616-4c31b5216f47?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
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
