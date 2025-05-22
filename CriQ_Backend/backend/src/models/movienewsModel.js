const mongoose=require('mongoose');

const movienewsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{    
        type:String,    
        required:true,
    },
    // imageUrl:{type:String,required:true},

    imageUrl: {
        landscape: { type: String },
        portrait: { type: String },
        thumbnail: { type: String }
    },
    images: [
        {
            landscape: { type: String },
            portrait: { type: String },
            thumbnail: { type: String }
        }
    ]
},
{
    timestamps: true, //  This adds both `createdAt` and `updatedAt` fields
});

// module.exports = mongoose.model('Movienews', movienewsSchema);

module.exports = mongoose.models.Movienews || mongoose.model('Movienews', movienewsSchema);
