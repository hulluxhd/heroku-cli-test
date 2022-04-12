import { Formik } from "formik"
import { useEffect, useState } from "react"
import {FiEdit3} from "react-icons/fi"
import {FaTrash} from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify';

import "./style.css"

function App() {

  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(false)
  const notify = () => {
    toast.success("Cadastrado com sucesso!")
  }

  //usando useEffect para chamar a api assim que os componentes forem montados
  useEffect(()=>{
    getTodos()
    
  }, [])

  //get

 async function getTodos(){
   setLoading(true)
   try{
    const data = await fetch('http://localhost:3000/api/todo').then(res => res.json())

    const {todos} = data

    setDados(todos)
    console.log(todos)

  } catch (erro){
    alert(erro)
  }
  setLoading(false)
  }

  //post

 async function submit(values){

    const body = {
          title: values.title,
          description: values.description,
          status: false,
          date: new Date()
    }
    try{
    await fetch("http://localhost:3000/api/todo", {
      method: "POST",
      body: JSON.stringify(body)
    })
    
    notify()
    getTodos()
  } catch(erro){
    alert("erro ao cadasdtrar")
  }
  }

  async function deletePost(id){

    try{
      await fetch(`http://localhost:3000/api/todo/${id}`, {method: "DELETE"})
      getTodos()
      toast.info("Deletado.", {
        autoClose: 2000
      })
    } catch(erro){
      alert(erro)
    }

  }


  return (
    <div className="container">
<ToastContainer />
      <Formik
        initialValues={{
          title: "",
          description: "",
          status: "",
          date: ""
        }}
        validate={(values) => {
          const errors = {}
          if (!values.title) errors.title = "Preencha o campo"
          if (!values.description) errors.description = "Preencha o campo"
          return errors
        }}
        onSubmit={(values) => {submit(values)}}
        className="form"
      >

        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <h2 style={{ textAlign: "center", marginTop:"25px" }}>TodoList 2.0 - semeando requisições, o retorno</h2>
            <div className="form-inputs">
              <label>
                <span>Título</span>
                <input type="text" {...formik.getFieldProps("title")} />
                <span>{formik.errors.title ? <span>{formik.errors.title}</span> : null}</span>
              </label>
              <label>
                <span>Descrição</span>
                <input type="text" {...formik.getFieldProps("description")} />
                <span>{formik.errors.description ? <span>{formik.errors.description}</span> : null}</span>
              </label>
            </div>
            <div className="form-buttons">
              <button type="submit">Cadastrar</button>
              <button onClick={formik.resetForm}>Limpar</button>
            </div>
          </form>
        )}
      </Formik>
      <div className="registros">
        <ul>
        {!loading ? dados.map((dado) => (
            <li className="registros-item">
              <div className="registros-info">
                <h3>{dado.title}</h3>
                <p>{dado.description}</p>
                <span>{dado.date}</span>
              </div>
              <div className="registros-buttons">
                <FiEdit3 />
                <FaTrash onClick={()=>deletePost(dado.id)} />
              </div>
            </li>
          )) :  <span>Carregando...</span>}
          
        </ul>
      </div>
    </div>

  );
}

export default App;
