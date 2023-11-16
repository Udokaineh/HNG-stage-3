import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate, Link } from "react-router-dom"
import { CameraIcon } from "./Icons";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const auth = getAuth();
    const handleLogin = async () => {
        try {
            const userDetails = await signInWithEmailAndPassword(auth, email, password);
            const user = userDetails.user;
            console.log("User logged in:", user);
            setIsLoggedIn(true);
            setError(null);
        } catch (error) {
            const myError = error.message;
            const slicedError = myError.slice(myError.indexOf(":") + 1);
            setError(slicedError);
        }
    };

    return (
        <div className="container">
            {isLoggedIn ? (
                <Navigate to="/home-page" />
            ) : (
                <div className="wrapper">
                    <div className="left-decor">
                        <div className="login-logo"><CameraIcon /><p>Image Gallery</p></div>
                    </div>
                    <div className="right">
                        <div className="header-text">
                            <h2>Welcome back!</h2>
                        </div>
                        <div className="email-details">
                            {error && <p className="error">{error}</p>}
                            <div className="email-div">
                                <p>Email</p>
                                <input
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="password-div">
                                <p>Password</p>
                                <input
                                    type="password"
                                    placeholder="1Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="btn-div">
                            <button onClick={handleLogin} className="details-btn">Login</button>
                            <p>Don't have an account? <Link to="/Signup">Signup</Link></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
