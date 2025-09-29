import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

function Header() {
  return (
    <header className="header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: '60px',
    }}>
      <Link to="/home" style={{ textDecoration: 'none', height: 'fit-content', alignItems: 'center', display: 'flex' }}>
        <img
          src="/isologo.svg"
          alt="Outfit Lab Logo"
          style={{ height: '40px' }}
        />
      </Link>

      <Link to="/profile" style={{ textDecoration: 'none' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}>
          <User size={20} color="var(--white)" />
        </div>
      </Link>
    </header>
  )
}

export default Header