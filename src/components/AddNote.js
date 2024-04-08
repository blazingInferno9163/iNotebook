import React, { useState } from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext } from 'react';
const AddNote = (props) => {
const context=useContext(noteContext);
const {addNote}=context

  const[note, setNote]=useState({title:"",description:"", tag:""})

  const handleClick=(e)=>{
    e.preventDefault()
    addNote(note.title,note.description,note.tag)
    setNote({title:"",description:"",tag:""})
    props.showAlert("Added Successfully", "success")
  }

  const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
  }
  return (
    <div className='container my-3 mx-5'>
     <h1>Add a note</h1>

     <div className="mb-3">
  <label htmlFor="title" className="form-label" >Title</label>
  <input type="text" className="form-control" id="title" value={note.title} name='title'onChange={onChange} placeholder="name@example.com"minLength={5} required/>
</div>
<div className="mb-3">
  <label htmlFor="description" className="form-label">Description</label>
  <textarea className="form-control" id="description"value={note.description}  name='description' rows="3" onChange={onChange}minLength={5} required></textarea>

</div>

<div className="mb-3">
  <label htmlFor="tag" className="form-label">Tag</label>
  <input type='text' className="form-control" id="tag" value={note.tag} name='tag' rows="3" onChange={onChange}/>

</div>
<button disabled={note.title.length<5||note.description.length<5} type='submit' className='btn btn-primary' onClick={handleClick}>Add Note</button>
</div> 
  )
}

export default AddNote