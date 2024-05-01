import FaIcon from '@/components/FaIcon'
import { AUTHOR } from '@/defaults'

export default function Footer() {
  return <div className="footer small">
    <a href={AUTHOR.url} target="_blank" rel="noopener noreferrer">
      <FaIcon icon="github" mr />
      {AUTHOR.title}
    </a>
  </div>
}
