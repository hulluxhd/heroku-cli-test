import { Formik } from "formik"
import { useEffect, useState } from "react"
import { FiEdit3 } from "react-icons/fi"
import { FaTrash } from "react-icons/fa"
import { AiOutlineCheck } from "react-icons/ai"
import { ToastContainer, toast } from 'react-toastify';

import "./style.css"

function App() {

  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [id, setId] = useState("")

  const notify = (string) => {
    toast.success(`${string}`)
  }



  //usando useEffect para chamar a api assim que os componentes forem montados
  useEffect(() => {
    getTodos()

  }, [])

  //get

  async function getTodos() {
    setLoading(true)
    try {
      const data = await fetch('http://localhost:3000/api/todo').then(res => res.json())

      const { todos } = data

      setDados(todos)


    }
    catch (erro) {
      alert(erro)
    }
    setLoading(false)
  }

  //post

  async function submit(values) {

    const body = {
      title: values.title,
      description: values.description,
      status: false,
      date: new Date()
    }
    try {
      await fetch("http://localhost:3000/api/todo", {
        method: "POST",
        body: JSON.stringify(body)
      })

      limparStates()
      notify("Cadastrado com sucesso!")
      getTodos()
    } catch (erro) {
      alert("erro ao cadasdtrar")
    }
  }

  async function deletePost(id) {

    try {
      await fetch(`http://localhost:3000/api/todo/${id}`, { method: "DELETE" })
      getTodos()
      toast.info("Deletado.", {
        autoClose: 2000
      })
    } catch (erro) {
      alert(erro)
    }

  }

  const fillForm = (values) => {
    setTitle(values.title)
    setDescription(values.description)
    setId(values.id)
  }

  function limparStates() {
    setDescription("")
    setId("")
    setTitle("")
    
  }

  async function editTodo(valores) {

    const obj = {
      title: valores.title,
      description: valores.description,
      date: new Date()
    }

    try {

      await fetch("http://localhost:3000/api/todo/" + id, {
        method: "PATCH",
        body: JSON.stringify(obj)
      })
      notify("Atualizado!")
      getTodos()


    }
    catch (error) {
      alert(error)
    }
    finally {
      limparStates()
    }


  }

  //patch

  async function attState(status, id) {
    try {
      await fetch("http://localhost:3000/api/todo/" + id, {
        method: "PATCH",
        body: JSON.stringify({
          status: !status,
          date: new Date()
        })
      })
      getTodos()
      
    } catch (e) {
      alert(e)
    }
  }



  return (
    <div className="container">
      <ToastContainer />
      <Formik
        initialValues={{
          title: title,
          description: description,
          status: "",
          date: ""
        }}
        enableReinitialize
        validate={(values) => {
          const errors = {}
          if (!values.title) errors.title = "Preencha o campo"
          if (!values.description) errors.description = "Preencha o campo"
          return errors
        }}
        onSubmit={(values, { resetForm }) => {
          !id ? submit(values) : editTodo(values)
          resetForm()
        }}
        onReset={values => {
          values.title = ""
          values.description = ""
        }}

      >


        {(formik) =>


        (
          <form onSubmit={formik.handleSubmit}>
            <h2 style={{ textAlign: "center", marginTop: "25px" }}>TodoList 2.0 - semeando requisições, o retorno</h2>
            
            <div className="form-inputs">
            
              <label>
                <span>Título</span>
                <input type="text" value={formik.values.title} onChange={formik.onChange} {...formik.getFieldProps("title")} />
                <span>{formik.errors.title ? <span>{formik.errors.title}</span> : null}</span>
              </label>
            
              <label>
                <span>Descrição</span>
                <input type="text" value={formik.values.description} {...formik.getFieldProps("description")} />
                <span>{formik.errors.description ? <span>{formik.errors.description}</span> : null}</span>
              </label>
            
            </div>
            
            <div className="form-buttons">
              <button type="submit">{!id ? "Cadastrar" : "Atualizar"}</button>
              <button type="button" onClick={!id ? formik.resetForm : limparStates}>Limpar</button>
            </div>
          
          </form>
        )}
      </Formik>
      <div className="registros">
        <ul>
          {!loading ? dados.map((dado) => (
            <li key={dado.id} className="registros-item">

              <div className="registros-info">
                <h3>{dado.title}</h3>
                <p>{dado.description}</p>
                <span>{dado.date.split("T")[1].split(".")[0]}</span>
              </div>

              <div className="registros-buttons">
                <FiEdit3 onClick={() => fillForm(dado)} />
                <FaTrash onClick={() => deletePost(dado.id)} />
                <div
                  onClick={() => {
                    attState(dado.status, dado.id)
                  }}
                  style={dado.status ?
                    { maxHeight: "20px", maxWidth: "20px", background: "#FFF", borderRadius: "5px" } :
                    { height: "20px", width: "20px", background: "#FFF", borderRadius: "5px" }}>

                  {dado.status ? <AiOutlineCheck /> : null}
                </div>
              </div>
            </li>
          )) : <span>Carregando...</span>}
        </ul>
      </div>
    </div>


  );
}

export default App;
