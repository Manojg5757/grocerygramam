import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import Products from '../screens/Products';
import ProductDetails from '../screens/ProductDetails';
import Profile from '../screens/Profile';
import Cart from '../screens/Cart';
import Catering from '../screens/Catering';
import Orders from '../screens/Orders';
import AdminLogin from '../screens/AdminLogin';
import AdminDashboard from '../screens/AdminDashboard';
import PhoneAuth from '../screens/PhoneAuth';
import PushNotification from '../screens/PushNotification';
import ForgotPassword from '../screens/ForgotPassword';
import { myColors } from '../Utils/MyColors';
import UserName from '../screens/UserName';
import { useSelector } from 'react-redux';
import DeliveryDetails from '../screens/DeliveryDetails';
import OrderConfirmed from '../screens/OrderConfirmed';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsAndConditions from '../screens/TermsAndConditions';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// **Bottom Tabs Component (Main App)**
const BottomTabs = () => {
  const cartItems = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <Tab.Navigator
    
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: myColors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 10 },
      })}
    >
      <Tab.Screen  name="Home" component={Home} />
      <Tab.Screen name="Products" component={Products} />
      <Tab.Screen name="Cart" component={Cart}
       options={{
        tabBarBadge: cartCount > 0 ? cartCount : null,
        tabBarBadgeStyle: {
          backgroundColor: 'red',
          color: 'white',
        },
      }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

// **Stack Navigator (Handles Auth + Main App)**
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Authentication Screens */}
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="UserName" component={UserName} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        
        {/* Main App (Bottom Tabs) */}
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name='Catering' component={Catering} />
        <Stack.Screen name='Orders' component={Orders} />
        <Stack.Screen name='AdminLogin' component={AdminLogin} />
        <Stack.Screen name='AdminDashboard' component={AdminDashboard} />
        <Stack.Screen name='PhoneAuth' component={PhoneAuth} />
        <Stack.Screen name='PushNotification' component={PushNotification} />
        <Stack.Screen name='ForgotPassword'component={ForgotPassword} />
        <Stack.Screen name='DeliveryDetails' component={DeliveryDetails} />
        <Stack.Screen name='OrderConfirmed' component={OrderConfirmed} />
        <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
        <Stack.Screen name='TermsAndConditions' component={TermsAndConditions} />
        
        {/* Additional Screens (Not in Bottom Tabs) */}
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
