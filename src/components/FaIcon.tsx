export default function FaIcon({ icon, mr }: { icon: string; mr?: boolean }) {
  const classes: string[] = ['fa', 'fa-fw']

  classes.push(`fa-${icon}`)

  if (mr) classes.push('mr-1')

  return <i className={`${classes.join(' ')}`} />
}
