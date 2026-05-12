// @ts-ignore
import './loading.css'

export default function Loading({ loading }: { loading: boolean }) {

    if (!loading) return null

    if (loading) return (
        <div className='loader-Cortina'>
            <p className="loader"><span>Carregando...</span></p>
        </div>
    )
}