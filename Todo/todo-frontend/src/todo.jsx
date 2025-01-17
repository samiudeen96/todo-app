import { useEffect } from "react";
import { useState } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const apiUrl = "http://localhost:8000";

  useEffect(() => {
    getTodos();
  }, []);

  const handleSubmit = () => {
    setError("");
    console.log("clicked");

    if (title.trim() !== "" && description.trim() !== "") {
      fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setTimeout(() => {
              setSuccess("");
            }, 3000);
          }
        })
        .catch(() => {
          setError("Failed to connect to the server");
          setTimeout(() => {
            setError("");
          }, 5000);
          setSuccess(""); // Clear success message
        });
    } else {
      setError("Title and Description should not empty");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const getTodos = () => {
    fetch(`${apiUrl}/todos`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setTodos(res);
      });
  };

  return (
    <>
      <div className="p-3 bg-black text-center">
        <h1 className="text-white text-2xl font-semibold">
          Todo project with MERN stack
        </h1>
      </div>
      <div className="pt-5">
        <h2 className="text-1xl font-semibold">Add todo</h2>
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-4 w-3/4">
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              class="w-full border-2 border-gray-300 bg-transparent p-2 text-gray-800 focus:border-blue-500 focus:outline-none rounded-lg"
            />

            <input
              type="text"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              class="w-full border-2 border-gray-300 bg-transparent p-2 text-gray-800 focus:border-blue-500 focus:outline-none rounded-lg"
            />
          </div>

          <button
            className="py-2 px-10 rounded-lg bg-orange-300 font-semibold"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {success && <p class="text-green-500">{success}</p>}
        {error && <p class="text-red-500">{error}</p>}
      </div>

      <div className="pt-5">
        <h2 className="text-1xl font-semibold">Tasks</h2>

        {todos.map((item) => 
          <div className="flex mt-3 border-2 p-4 rounded-lg">
            <div>
              <h3 className="font-semibold text-blue-500">{item.title}</h3>
              <p className="pt-1">{item.description}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Todo;
