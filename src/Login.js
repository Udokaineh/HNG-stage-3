import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [error, setError] = useState(null)

    const auth = getAuth()
    const handleLogin = async () => {
        try {
            const userDetails = await signInWithEmailAndPassword(auth, email, password)
            const user = userDetails.user
            console.log('User logged in:', user);
            setIsLoggedIn(true);
            setError(null)
        } catch (error) {
            const myError = (error.message)
            const slicedError = myError.slice(myError.indexOf(":") + 1)
            setError(slicedError)
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setEmail("")
        setPassword("")
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <p>You are logged in </p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <div>
                        <h2>Welcome back</h2>
                        <p>Login to continue</p>
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
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}
        </div>
    )
}


export default Login;