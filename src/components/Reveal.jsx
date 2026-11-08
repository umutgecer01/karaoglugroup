export default function Reveal({ as: Tag = 'div', children, className = '' }) {
  return <Tag className={className}>{children}</Tag>;
}
