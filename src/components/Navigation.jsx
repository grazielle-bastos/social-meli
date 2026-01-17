import { NavLink } from "react-router-dom";
import UserSelector from "./UserSelector";
import { useUser } from "../UserContext";
import "./Navigation.css";

function Navigation() {
  const { userId } = useUser();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img
          src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__small.png"
          alt="Logo"
          className="logo"
        />
      </div>

      <div className="nav-links">
        <NavLink to="/" end>
          Início
        </NavLink>

        {userId ? (
          <>
            <NavLink to={`/users/${userId}/followers`}>Quem me segue</NavLink>
            <NavLink to={`/users/${userId}/followed`}>Quem eu sigo</NavLink>
            <NavLink to={`/users/${userId}/feed`}>Meu Feed</NavLink>
            <NavLink to="/publish">Criar Publicação</NavLink>
          </>
        ) : (
          <>
            <span className="disabled-link">Quem me segue</span>
            <span className="disabled-link">Quem eu sigo</span>
            <span className="disabled-link">Meu Feed</span>
            <span className="disabled-link">Criar Publicação</span>
          </>
        )}
      </div>

      <UserSelector />
    </nav>
  );
}

export default Navigation;
