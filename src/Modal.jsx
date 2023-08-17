import "./Modal.css";

const Modal = ({children, isOpen, closeModal, title}) => {
    return(
        <article className={`modal ${isOpen&&"is-open"}`} >
            <div className="modal-container">
                <button className="modal-close" onClick={()=>closeModal()}>x</button>
                <h1>{title}</h1>
                 {children}
            </div>
        </article>
    )
}

export default Modal; 