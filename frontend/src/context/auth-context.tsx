"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
// ...удалён firebase импорты...
import { auth, db } from "@/lib/firebase/firebase";

type UserRole = "driver" | "shipper" | "dispatcher" | "admin";

interface AppUser {
  uid: string;
  email: string | null;
  role?: UserRole;
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: data.role,
            name: data.name,
            phone: data.phone,
          });
        } else {
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        setProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      logout,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
