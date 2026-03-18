import '../styles/footer.css'
import mockPfp from '../assets/mock_pfp.png'

export default function ProfileButton(props: { onClick?: () => void }) {
  return (
    <img src={mockPfp} alt="Profile" className="profile-button" onClick={props.onClick} style={{ cursor: 'pointer' }} />
  )
}

