import Container from "../components/Container";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../services/firebaseConnection";
import { GrUpdate } from "react-icons/gr";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { VscFeedback } from "react-icons/vsc";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

type Feedback = {
  id: string;
  userName: string;
  date: string;
  comment: string;
  rating: number;
  createdAt: any;
};

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orderFilter, setOrderFilter] = useState<
    "dateDesc" | "dateAsc" | "ratingDesc" | "ratingAsc"
  >("dateDesc");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchFeedbacks = async () => {
    const feedbacksRef = collection(db, "feedbacks");
    const snapshot = await getDocs(feedbacksRef);
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
    setFeedbacks(docs);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    switch (orderFilter) {
      case "dateDesc":
        return b.createdAt?.toMillis() - a.createdAt?.toMillis();
      case "dateAsc":
        return a.createdAt?.toMillis() - b.createdAt?.toMillis();
      case "ratingDesc":
        return b.rating - a.rating;
      case "ratingAsc":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // FILTRO POR NOME OU COMENTÁRIO
  const filteredFeedbacks = sortedFeedbacks.filter(
    (fb) =>
      fb.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      fb.comment.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <>
      <Container>
        <div className="p-8 mt-5 bg-white rounded-3xl shadow-lg max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extralight text-gray-800 flex items-center gap-2">
              <VscFeedback size={28} />
              Feedbacks
            </h2>
            <div className="flex gap-3">
              <button
                onClick={fetchFeedbacks}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-sm transition"
                aria-label="Recarregar lista"
                title="Recarregar lista"
              >
                <GrUpdate size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-3 bg-red-100 text-red-500 hover:bg-red-200 rounded-xl shadow-sm transition"
                aria-label="Sair"
                title="Sair da conta"
              >
                <FiLogOut size={20} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <label
              htmlFor="orderFilter"
              className="text-gray-600 font-light whitespace-nowrap"
            >
              Ordenar por:
            </label>
            <select
              id="orderFilter"
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-light focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="dateDesc">Data: Mais recentes</option>
              <option value="dateAsc">Data: Mais antigas</option>
              <option value="ratingDesc">Nota: Maior para menor</option>
              <option value="ratingAsc">Nota: Menor para maior</option>
            </select>
          </div>

          {/* INPUT DE FILTRO */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nome ou comentário..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {["Data", "Nome", "Comentário", "Nota"].map((title) => (
                    <th
                      key={title}
                      className="text-left text-gray-400 text-sm font-light px-6 py-4 select-none"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentFeedbacks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 py-10 font-light"
                    >
                      Nenhum feedback encontrado.
                    </td>
                  </tr>
                ) : (
                  currentFeedbacks.map((fb) => (
                    <tr
                      key={fb.id}
                      className="bg-white hover:bg-indigo-50 transition cursor-default rounded-xl shadow-sm"
                    >
                      <td className="py-4 px-6 text-sm text-gray-600 font-light whitespace-nowrap">
                        {fb.createdAt?.toDate().toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-light whitespace-nowrap">
                        {fb?.userName}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-normal max-w-xl break-words">
                        {fb.comment}
                      </td>
                      <td className="py-4 px-6 text-sm text-indigo-600 font-semibold whitespace-nowrap">
                        <div className="flex gap-0.5 items-center">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= fb.rating ? (
                              <AiFillStar
                                key={star}
                                size={18}
                                className="text-yellow-500"
                              />
                            ) : (
                              <AiOutlineStar
                                key={star}
                                size={18}
                                className="text-gray-300"
                              />
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-6 mt-6">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Página anterior"
            >
              <FiChevronLeft size={20} />
            </button>
            <span className="text-gray-500 font-light">
              Página {currentPage} de {totalPages || 1}
            </span>
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Próxima página"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}
