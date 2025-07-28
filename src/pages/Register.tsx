import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebaseConnection";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

type RegisterFormData = yup.InferType<typeof schema>;

export default function Register() {
  const { handleInfoUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: RegisterFormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });
        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid,
        });
        navigate("/home", { replace: true });
        toast.success("Bem-vindo à plataforma");
      })
      .catch(() => {
        toast.error("Erro ao cadastrar este usuário");
      });
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-6 bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl max-w-xl w-full p-8 rounded-2xl border border-zinc-200"
      >
        <h2 className="text-3xl font-light text-gray-800 mb-6 flex items-center justify-center gap-2">
          <FaUserPlus size={24} className="text-indigo-600" />
          Crie sua conta
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            placeholder="Nome completo"
            {...register("name")}
            className="w-full h-12 px-4 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            placeholder="Digite seu email"
            {...register("email")}
            className="w-full h-12 px-4 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            placeholder="Digite sua senha"
            {...register("password")}
            className="w-full h-12 px-4 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 w-full rounded-md text-white h-12 font-medium transition-all"
        >
          Cadastrar
        </button>

        <p className="text-sm text-center text-zinc-600 mt-4">
          Já tem uma conta?{" "}
          <Link
            to="/"
            className="text-indigo-600 hover:underline font-medium"
          >
            Acesse
          </Link>
        </p>
      </form>
    </div>
  );
}
