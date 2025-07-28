import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { auth } from "../services/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { VscSignIn } from "react-icons/vsc";

const schema = yup.object({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});
type LoginFormData = yup.InferType<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  function onSubmit(data: LoginFormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate("/home", { replace: true });
        toast.success(`Bem-vindo de volta`);
      })
      .catch(() => {
        toast.error("Erro ao logar no sistema");
      });
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl max-w-md w-full p-8 rounded-2xl border border-zinc-100"
      >
        <h2 className="text-2xl font-light text-zinc-800 mb-6 flex items-center gap-2 justify-center">
          <VscSignIn size={28} className="text-indigo-600" />
          Acessar Plataforma
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm text-zinc-600 mb-1">
            E-mail
          </label>
          <input
            {...register("email")}
            type="email"
            name="email"
            placeholder="seu@email.com"
            className={`w-full h-11 px-4 border rounded-md text-sm focus:outline-none transition-all ${
              errors.email
                ? "border-red-400 focus:ring-red-300"
                : "border-zinc-300 focus:ring-indigo-500"
            } focus:ring-2`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block text-sm text-zinc-600 mb-1"
          >
            Senha
          </label>
          <input
            {...register("password")}
            type="password"
            name="password"
            placeholder="Digite sua senha"
            className={`w-full h-11 px-4 border rounded-md text-sm focus:outline-none transition-all ${
              errors.password
                ? "border-red-400 focus:ring-red-300"
                : "border-zinc-300 focus:ring-indigo-500"
            } focus:ring-2`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Ainda não possui uma conta?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
