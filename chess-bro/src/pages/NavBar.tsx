import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div>
            <ul className="flex justify-between items-center w-full h-10 bg-gray-300">
                <NavBarButton page="Home" to="/" />
                <NavBarButton page="Profile" to="/profile" />
                <NavBarButton page="Map" to="/map" />
                <NavBarButton page="Login" to="/login" />
            </ul>
        </div>
    )
}

function NavBarButton({page, to} : {page: string, to: string}){
    return (
        <Link to={to} className="border-1 m-2 p-1 w-1/10 text-center">
            {page}
        </Link>
    )
}