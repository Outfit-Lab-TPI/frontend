import { Link } from 'react-router-dom'
import { User, Wifi } from 'lucide-react'

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
          alt="Outfit-Lab-logo"
          style={{ height: '40px' }}
        />
      </Link>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* <Link to="/test-connection" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#2196f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}>
            <Wifi size={20} color="white" />
          </div>
        </Link> */}

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
      </div>
    </header>
  )
}

export default Header