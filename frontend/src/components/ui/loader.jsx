export default function Loader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <p>Carregando...</p>
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
    )
}