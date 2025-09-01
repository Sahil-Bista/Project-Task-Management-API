import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : true
    },
    description : {
        type : String,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    members :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
});

//pre-hook or a middleware that is carried out before 'save' of the document that ensures that every owner is also a member
ProjectSchema.pre('save',function(next){
    if(this.owner && !this.members.includes(this.owner)){
        this.members.push(this.owner);
    }
    next();
})

export const ProjectModel = mongoose.model('Project', ProjectSchema);