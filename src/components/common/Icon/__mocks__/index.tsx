interface IconProps {
  name: string
  size?: number
  color?: string
}

const Icon: React.FC<IconProps> = ({ name, size, color }) => (
  <span 
    className='icon' 
    data-testid={`icon-${name}`}
    style={{ fontSize: size, color }}
  >
    {name}
  </span>
)

export default Icon