```javascript
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { useIsMounted } from './useIsMounted'; // Custom hook

function MyComponent() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const db = getDatabase();
  const isMounted = useIsMounted();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && isMounted.current) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        }
      } else if (!isMounted.current){
        console.log("Component unmounted, ignoring update");
      }else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ... rest of the component
}

// useIsMounted custom hook
export function useIsMounted() {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
}
```