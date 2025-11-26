import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const uid = userCredential.user.uid;
          const userDoc = await getDoc(doc(db, "users", uid));

          return {
            uid,
            email: credentials.email,
            ...userDoc.data(),
          };
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
