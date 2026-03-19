import mockPfp from '../assets/mock_pfp.png'
import '../styles/footer.css'

export default function ProfileButton(props: { onClick?: () => void }) {
  return (
    <img src={mockPfp} alt="Profile" className="profile-button" onClick={props.onClick} style={{ cursor: 'pointer' }} />
  )
}

