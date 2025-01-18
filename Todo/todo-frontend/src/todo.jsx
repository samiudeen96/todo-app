import { useEffect } from "react";
import { useState } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // edit
  const [editId, setEditId] = useState(-1)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')


  const apiUrl = "http://localhost:8000";

  useEffect(() => {
    getTodos();
  });

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

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  }

  const handleEditCancel = () => {
    setEditId(-1)
  }

  const handleUpdate = () => {
    setError("");
    console.log("clicked");

    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(`${apiUrl}/todos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {

            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            })

            setTodos(updatedTodos);
            setSuccess("Item added successfully");
            setTimeout(() => {
              setSuccess("");
            }, 3000);
            setEditId(-1)
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

  const handleDelete = (id) => {
    if(window.confirm('Are you sure want to delete?')){
      fetch(`${apiUrl}/todos/${id}`,{
        method: 'DELETE'
      }).then(()=>{
        const updatedTodos = todos.filter((item)=> item._id !== id);
        setTodos(updatedTodos)
      })
    }
  }

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
              className="w-full border-2 border-gray-300 bg-transparent p-2 text-gray-800 focus:border-blue-500 focus:outline-none rounded-lg bg-gray-100"
            />

            <input
              type="text"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-gray-300 bg-transparent p-2 text-gray-800 focus:border-blue-500 focus:outline-none rounded-lg bg-gray-100"
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
          <div className="mt-3 border-2 p-4 rounded-lg">
            <div className="flex justify-between gap-4">
              {/* <h3 className="font-semibold text-blue-500">{item.title}</h3>
                <div className="flex gap-3">
                  <button className="text-sm text-blue-700" onClick={()=>handleEdit(item)}>Edit</button>
                  <button className="text-sm text-red-500">Delete</button>
                </div> */}

              {
                editId == -1 || editId !== item._id ? <>
                  <div>
                    <h3 className="font-semibold text-blue-500">{item.title}</h3>
                    <p className="pt-1">{item.description}</p>
                  </div>
                </> : <>
                  <div className="flex gap-4 w-full">
                    <input
                      type="text"
                      placeholder="Add title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border-2 border-gray-300 bg-transparent p-2 text-gray-800 focus:border-blue-500 focus:outline-none rounded-lg bg-gray-100"
                    />

                    <input
                      type="text"
                      placeholder="Add description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      class="w-full border-2 border-gray-300 bg-transparent p-2 text-gray-800 focus:border-blue-500 focus:outline-none rounded-lg bg-gray-100"
                    />
                  </div>
                </>
              }


              <div className="flex gap-3">
                {editId == -1 ? <><button className="text-sm text-blue-700" onClick={() => handleEdit(item)}>Edit</button></> : <><button className="text-sm text-blue-700" onClick={handleUpdate}>Update</button></>}

                {
                  editId == -1 ? <><button className="text-sm text-red-500" onClick={()=> handleDelete(item._id)}>Delete</button></> : <>
                    <button className="text-sm text-black-500" onClick={handleEditCancel}>Cancel</button></>
                }




              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default Todo;
