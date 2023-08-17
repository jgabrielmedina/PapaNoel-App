import { useEffect, useState, useRef } from 'react'
import Modal from './Modal';
import './App.css'
import { useModal } from './useModal';


function App() {

  const [isOpenModal, openModal, closeModal] = useModal(false);
  const [isOpenModal2, openModal2, closeModal2] = useModal(false);



  const obtenerLista = () => {  // 2) se encarga de recuperar la informacion del localStorage
    var datos = localStorage.getItem("list");  //declaro una variable que va a guardar lo que esta en el localStorage 
    if (datos) {  // pregunto si datos esta vacio o tiene contenido 
      return JSON.parse(datos);  //en el caso de haber contenido, retorno la informacion a alguien que lo utilice 
    } else {
      return [];
    }
  }

  /*   const [list, setList] = useState(obtenerLista()) 3) *///el list se va a inicializar con la informacion del localStorage
  const sectionToPrintRef = useRef(null);
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('list') || '[]')) //lo mismo que arriba pero una linea
  const [error, setError] = useState('')
  const [edit, setEdit] = useState({
    id: '',
    name: "",
    destinatario: '',
    cantidad: '',
    img: ''
  })
  const [total, setTotal] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.text.value === "") {
      setError("el campo no debe de estar vacio")
      return
    }

    setList([...list, {
      id: new Date(),
      name: e.target.text.value,
      cantidad: parseInt(e.target.num.value),
      precio: parseInt(e.target.price.value),
      img: e.target.img.value,
      destinatario: e.target.destinatario.value,
    }
    ])

    e.target.text.value = "";
    e.target.destinatario.value = "";
    e.target.num.value = 1;
    setError("")
    closeModal()
    e.target.img.value = ''
  }

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list)) // 1) guardamos el nuevo elemento actualizado en el localstorage (en este caso list), pero hay que guardarlo en formato JSON (JSON.stringify) 
    setTotal(list.reduce((total, objeto) => total + (objeto.cantidad * objeto.precio), 0));
  }, [list])



  const deleteGif = (id) => {
    setList(list.filter((regalo) => regalo.id !== id))
  }

  const deleteAll = () => {
    setList([])
  }

  const handleEdit = (regalo) => { //cuando se ejecuta el handleEdit recibo como parametro el regalo 
    openModal2() //abro el modal 2 
    setEdit({    //seteo en mi estado Edit el objeto que me llego como parametro 
      id: regalo.id,
      name: regalo.name,
      precio: regalo.precio,
      destinatario: regalo.destinatario,
      cantidad: regalo.cantidad,
      img: regalo.img
    })
  }


  const handleSubmitEdit = (e) => { //prevent para evitar que el formulario se envie
    e.preventDefault();
    setList(list.map((regalo) => regalo.id === edit.id ? edit : regalo)) //mapeo los regalos y si encuentro el mismo id lo remplazo por mi objeto editado
    closeModal2() //cierro el modal 
  }



  return (
    <div className='sm:grid sm:grid-cols-2 sm:mt-auto sm:h-10'>
      <div className='bg-white rounded-3xl py-4 shadow-lg '>

        <Modal isOpen={isOpenModal} closeModal={closeModal}>
          <div className='p-5 border border-green-700'>
            <h1 className='text-green-700'>Comprar</h1>
            <form onSubmit={handleSubmit} className='w-100'>
              <input
                type="text"
                name='text'
                placeholder='Regalo'
                className='border border-b-green-700 w-full mt-1'
              />
              <br />
              <input
                type="number"
                name='price'
                placeholder='Precio en ARS'
                className='border border-b-green-700 w-full mt-1'
                min="0"
                max="700000"

              />
              <br />
              <input
                type="text"
                name='destinatario'
                placeholder='Destinatario'
                className='border border-b-green-700 w-full mt-1'
              />
              <br />
              <input type='text' name='img' placeholder='Link de Imagen' className='border border-b-green-700 w-full mt-1' />
              <br />
              <input type='number' name="num" min="0" max="10" placeholder='Cantidad' className='border border-b-green-700 w-full mt-1'></input>
              <br />
              <button type='submit' className='border border-green-700 hover:bg-green-700 hover:text-white p-2 rounded-xl mt-2 px-6 text-black text-xs'>Agregar</button>
            </form>
            {error.length > 0 && <p>{error}</p>}
          </div>
        </Modal>
        <Modal isOpen={isOpenModal2} closeModal={closeModal2}>  {/* Modal 2 de Edicion */}
          <div className='p-5 border border-green-700'>
            <h1 className='text-green-700'>Editar</h1>
            <form onSubmit={handleSubmitEdit}>
              <input
                type="text"
                name='text'
                value={edit.name}   //le paso al value la propiedad de mi estado edit correspondiente, en este caso name 
                onChange={e => setEdit({ ...edit, name: e.target.value })}  //cada vez que edito el name, seteo nuevamente el estado con el valor del input
                placeholder='Regalo'
                className='border border-b-green-700 w-full mt-1'
              />
              <br />
              <input
                type="number"
                name='price'
                placeholder='Precio en ARS'
                value={edit.precio}
                onChange={e => setEdit({ ...edit, precio: parseInt(e.target.value) })}
                min="0"
                max="700000"
                className='border border-b-green-700 w-full mt-1'
              />
              <br />
              <input
                type="text"
                name='destinatario'
                value={edit.destinatario}
                onChange={e => setEdit({ ...edit, destinatario: e.target.value })}
                placeholder='Destinatario'
                className='border border-b-green-700 w-full mt-1'
              />
              <br />
              <input type='text'
                name='img'
                placeholder='link de Imagen'
                value={edit.img}
                onChange={e => setEdit({ ...edit, img: e.target.value })}
                className='border border-b-green-700 w-full mt-1'
              />
              <br />
              <input type='number' name="num" min="0" max="100" placeholder='cantidad'
                value={edit.cantidad}
                onChange={e => setEdit({ ...edit, cantidad: parseInt(e.target.value) })}
                className='border border-b-green-700 w-full mt-1'
              >

              </input>
              <br />
              <button type='submit' className='border border-green-700 hover:bg-green-700 hover:text-white p-2 rounded-xl mt-2 px-6 text-black text-xs'>Editar</button> {/* //una vez hago el submit, llamo a la funcion handleSubmitEdit */}

            </form>
            {error.length > 0 && <p>{error}</p>}
          </div>
        </Modal>



        <div>
          <button className='border border-red-600 hover:bg-red-600 hover:text-white font-bold p-2 rounded-2xl my-2 px-6  text-black duration-200' onClick={openModal}>Agregar Regalo</button>
          <h1 className='font-bold text-3xl p-1 my-2 '>Regalos</h1>
          {list.length === 0 && <p className='text-green-700 p-1 my-5'>No hay regalos Grinch!</p>}
        </div>

        <ul>
          {list.map((regalo) =>
            <div key={regalo.id}>
              <li className='border rounded-md flex items-center mx-4 justify-around my-2 py-1'>
                <img src={regalo.img} alt="foto" className='w-12' />
                <div className='flex flex-col'>
                  <p>{regalo.name} &#40;{regalo.cantidad}&#41; </p>
                  <p className='text-green-700 text-xs text-start'>{regalo.destinatario}</p>
                </div>

                - {(regalo.cantidad * regalo.precio).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}

                <button className='text-gray-300 bg-white border rounded-full w-6  h-6 text-xs hover:bg-green-700 hover:text-white hover:border-none duration-200' onClick={() => handleEdit(regalo)}>E</button>  {/* si doy click en editar arranco la funcion handleEdit y le paso como parametro el obj regalo */}
                <button className='text-gray-300 bg-white border rounded-full w-6  h-6 text-xs hover:bg-red-600 hover:text-white hover:border-none duration-200' onClick={() => deleteGif(regalo.id)}> X </button>
              </li>
            </div>
          )}
        </ul>

        {total !== 0 && <p>Total: {total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>} {/* short-circuit ternary operator */}

        {list.length !== 0 && <button className='text-gray-300 mt-2 border px-2 rounded-md hover:bg-green-700 hover:border-green-700 duration-200 hover:text-white' onClick={() => deleteAll()}>Eliminar todo</button>}


      </div>

      <div className='w-80 sm:ml-20 sm:w-60'>
        <img src="/bgGift.jpg" alt="foto" className='pt-5 sm:max-w-lg' />
      </div>

    </div>

  )
}


export default App
