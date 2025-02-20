import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div>
            <ul>
                <Link to='/'>Home</Link>
                <Link to='/profile'>Profile</Link>
                <Link to='/login'>Login</Link>
            </ul>
        </div>
    )
}