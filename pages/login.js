
import { useState } from "react";
import { useRouter } from "next/router";

const USERS = {
  Profi: "asdj#aslkdj!123ks",
  Profi2: "asdj#aslkdj!123ks",
  Profi3: "asdj#aslkdj!123ks",
  Profi4: "asdj#aslkdj!123ks",
};

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (USERS[login] === password) {
      localStorage.setItem("auth_user", login);
      router.push("/");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} /><br />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
