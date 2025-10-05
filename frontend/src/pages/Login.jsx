import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Loader2 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3472/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Falha no login");

      // salva token e redireciona
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login Admin</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Usuário</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none"
              placeholder="Digite o usuário"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Senha</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="text-gray-400 mr-2" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
              placeholder="Digite a senha"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex justify-center items-center transition"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Entrar"}
        </button>
      </form>
    </div>
  );
}
