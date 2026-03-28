import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  projectId: 'pocket-heist-ggss',
  appId: '1:770594644832:web:21608222e21ec24ac1b405',
  storageBucket: 'pocket-heist-ggss.firebasestorage.app',
  apiKey: 'AIzaSyBH7Om4Dpd2grLZb33oN1hcIVSEL4pbWwg',
  authDomain: 'pocket-heist-ggss.firebaseapp.com',
  messagingSenderId: '770594644832',
}

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(app)
export const auth = getAuth(app)
