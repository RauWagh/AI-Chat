import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    axios
      .post("/projects/create", { name: projectName })
      .then((res) => {
        setIsModalOpen(false);
        setProjectName("");
        setProject([...project, res.data.project]); // Add new project
      })
      .catch((error) => console.log(error))
      .finally(() => setIsSubmitting(false));
  }

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => setProject(res.data.projects))
      .catch((err) => console.log(err));
  }, []);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-6 bg-white shadow-lg rounded-lg flex flex-col justify-center items-center border-2 border-dashed border-gray-400 hover:bg-gray-50 transition"
        >
          <span className="text-lg font-semibold text-gray-700">New Project</span>
          <i className="ri-add-circle-line text-3xl text-blue-600 mt-2"></i>
        </button>

        {project.map((proj) => (
          <div
            key={proj._id}
            onClick={() => navigate(`/project`, { state: { project: proj } })}
            className="p-6 bg-white shadow-md rounded-lg cursor-pointer transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-xl font-bold text-gray-800">{proj.name}</h2>
            <p className="text-gray-500 mt-2">
              <i className="ri-user-line"></i> {proj.users.length} Collaborators
            </p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 transform transition-all scale-95 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 transition"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">&#9696;</span> Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
