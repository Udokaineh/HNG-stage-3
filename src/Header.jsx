import React from "react"
import { Link } from "react-router-dom"
import { LogoIcon } from "./Icons"

const Header = () => {
    return (
            <div className="header">
                <div className="logo-div">
                    <h1><LogoIcon /> Image Gallery</h1>
                    <p>Drag and drop Images to get started.</p>
                </div>
                <div className="button-div">
                    <div className="curved-gradient"></div>
                    <Link to="/"><button className="button">Logout</button></Link>
                </div>
            </div>
    )
}

export default Header;