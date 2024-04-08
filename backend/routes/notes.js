const express=require('express')
const Notes=require('../models/Notes')
const router=express.Router()
var fetchuser=require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

//Route1
//Get all the notes
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes=await Notes.find({user:req.user.id})
        res.json(notes)  
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }
    
})

//Route2
//Add a new note using POST
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:5}),
    body('description','atleast 5 char').isLength({min:5})
],async(req,res)=>{

    try {
        const{title,description,tag}=req.body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const note=new Notes({
        title,description,tag,user:req.user.id
    })

    const savedNote=await note.save()
    res.json(savedNote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }
    
})

//Route 3: Update an existing note

router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag}=req.body;

    try {

        const newNote={};
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag};

    //Find the note to be updated and update it
    let note=await Notes.findById(req.params.id);

    if(!note){
       return res.status(404).send("Not Found")
    }
    if(note.user.toString()!==req.user.id){
        return res.status(404).send("Not Allowed")
    }

    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }
    //Create newNote Obj

    
})

//Route 4
//Delete existing Note
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {
          //Find the note to be deleted and delete it
    let note=await Notes.findById(req.params.id);

    if(!note){
       return res.status(404).send("Not Found")
    }

    //Allow deletion only if user allows it
    if(note.user.toString()!==req.user.id){
        return res.status(404).send("Not Allowed")
    }

    note=await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",note:note});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }

})

  

module.exports=router