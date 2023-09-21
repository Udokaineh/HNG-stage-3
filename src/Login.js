import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import DropImages from "./DropImages";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const auth = getAuth();
    const handleLogin = async () => {
        try {
            const userDetails = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
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

    const handleLogout = () => {
        setIsLoggedIn(false);
        setEmail("");
        setPassword("");
    };

    return (
        <div className="container">
            {isLoggedIn ? (
                 <div>
                 <div>
                     <div>
                         <h1>Image Gallery</h1>
                         <p>Drag and drop Images to get started</p>
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
                            <h2>Welcome back!</h2>
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

                            <div class ="password-div">
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
                        <button onClick={handleLogin} className="details-btn">Login</button>
                        <p>Don't have an account? <a href="#signup">Signup</a></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
