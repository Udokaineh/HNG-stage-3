import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [error, setError] = useState(null)

    const auth = getAuth()
    const handleSignIn = async () => {
        try {
            const userDetails = await createUserWithEmailAndPassword(auth, email, password)
            const user = userDetails.user
            console.log('User signIn in:', user);
            setIsSignedIn(true);
            setError(null)
        } catch (error) {
            const myError = (error.message)
            const slicedError = myError.slice(myError.indexOf(":") + 1)
            setError(slicedError)
        }
    }

    const handleLogout = () => {
        setIsSignedIn(false)
        setEmail("")
        setPassword("")
    };

    return (
        <div>
            {isSignedIn ? (
                <div>
                    <p>You are logged in </p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <div>
                        <h2>Welcome</h2>
                        <p>Create an Account</p>
                    </div>
                    <div>
                        {error && <p>{error}</p>}
                        <div>
                            <p>Email</p>
                            <input type="email" placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <p>Password</p>
                            <input type="password" placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                    </div>
                    <button onClick={handleSignIn}>Create Account</button>
                </div>
            )}
        </div>
    )
}

export default Signup;
