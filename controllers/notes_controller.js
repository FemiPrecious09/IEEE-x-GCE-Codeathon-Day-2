const { createNoteDB, getNoteIdDB, sortNote, replaceNoteDB, updateNoteDB, deleteNoteDB, getSortNote } = require("../models/note_model")


const addNote = async (req,res)=>{
  const user = req.user
 const {title,body} = req.body
 if (!title || !body) {
  return res.status(400).send("Title and body are required")
 }
 const newnote = await createNoteDB(title,body,user.public_id)
 res.status(201).json(newnote) // Every Endpoint that returns a body should have a json
}

const getNoteId = async (req,res)=>{
 const id = req.params.id
 const note = await getNoteIdDB(id)
 if(!note){
  return res.status(404).send("Note Id not found")
 }
 res.status(200).json(note)
}

const getNote = async (req,res)=>{
 const page = parseInt(req.query.page,10) || 1
 const limit = parseInt(req.query.limit,10) || 10
 const sort = req.query.sort || "newest"
 let sortBy = ""
 if(sort === "title"){
   sortBy = "title ASC"
 }else if(sort === "newest"){
  sortBy = "created_at DESC"
 }else if(sort === "last updated"){
  sortBy = "updated_at DESC"
 }else{
  return res.status(404).send("Invalid Sort")
 }
 const startIndex = (page -1) * limit
 const user = req.user
 const note = await sortNote(sortBy,limit,startIndex,user.public_id)
 if(!note){
  return res.status(404).send("Note not found")
 }
 res.status(200).json(note)
}

const getAllNote = async (req,res)=>{
 const page = parseInt(req.query.page,10) || 1
 const limit = parseInt(req.query.limit,10) || 10
 const sort = req.query.sort || "newest"
 let sortBy = ""
 if(sort === "title"){
   sortBy = "title ASC"
 }else if(sort === "newest"){
  sortBy = "created_at DESC"
 }else if(sort === "last updated"){
  sortBy = "updated_at DESC"
 }else{
  return res.status(404).send("Invalid Sort")
 }
 const startIndex = (page -1) * limit

 const note = await getSortNote(sortBy,limit,startIndex)
 if(!note){
  return res.status(404).send("Note not found")
 }
 res.status(200).json(note)
}

const replaceNote = async (req,res)=>{
 const id = req.params.id
 const {title,body} = req.body
 if (!title || !body) {
  return res.status(400).send("Title and body are required")
 }
 const note = await replaceNoteDB(title,body,id)
 if(!note){
  return res.status(404).send("Note not found")
 }
 res.status(200).json(note)
}

const updateNote = async (req,res)=>{
 const id = req.params.id
 const {title,body} = req.body
 const note = await updateNoteDB(title,body,id)
 if(!note){
  return res.status(404).send("Note not found")
 }
 res.status(200).json(note)
}

const delNote = async (req,res)=>{
 const id = req.params.id
 const note = await deleteNoteDB(id)
 if(!note){
  return res.status(404).send("Note not found")
 }
 res.status(200).json(note)
}


module.exports = {getNote,addNote,getNoteId,replaceNote, updateNote, delNote, getAllNote}