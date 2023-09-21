import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import DropImages from "./DropImages";
import { Link } from "react-router-dom"

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [error, setError] = useState(null);

    const auth = getAuth();
    const handleSignIn = async () => {
        try {
            const userDetails = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userDetails.user;
            console.log("User signIn in:", user);
            setIsSignedIn(true);
            setError(null);
        } catch (error) {
            const myError = error.message;
            const slicedError = myError.slice(myError.indexOf(":") + 1);
            setError(slicedError);
        }
    };

    const handleLogout = () => {
        setIsSignedIn(false);
        setEmail("");
        setPassword("");
    };

    return (
        <div className="container">
            {isSignedIn ? (
                <div className="main-header-container">
                    <div className="main-header">
                        <div className="logo">
                            <h1>Image Gallery</h1>
                            <p>Drag and drop Images to get started.</p>
                        </div>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <div>
                        <DropImages />
                    </div>
                </div>
            ) : (
                <div className="wrapper">
                    <div className="left-decor"></div>
                    <div className="right">
                        <div className="header-text">
                            <h2>Hello, Get Started!</h2>
                        </div>
                        <div className="email-details">
                            {error && <p>{error}</p>}
                            <div className="email-div">
                                <p>Email</p>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div class="password-div">
                                <p>Password</p>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="btn-div">
                            <button onClick={handleSignIn} className="details-btn">Create Account</button>
                            <p>Already have an account? <Link to="/Login">Login</Link></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
