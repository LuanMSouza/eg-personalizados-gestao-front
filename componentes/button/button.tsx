import './button.css'
type btnProps = {
    text: string
    tipo: 'claro' | 'escuro'
    onClick?: () => void
}

export default function Button({ text, tipo, onClick }: btnProps) {
    return <button onClick={onClick} className={`btn ${tipo}`}>
        {text}
    </button>
}