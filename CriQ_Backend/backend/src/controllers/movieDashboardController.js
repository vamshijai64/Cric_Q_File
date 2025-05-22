const sectionModel = require('../models/sectionModel');
const titleModel = require('../models/titleModel');
const reviewModel = require('../models/reviewModel');
exports.getMovieDashboard = async (req, res) => {


try{
    const latestSections= await sectionModel
    .find()
    .sort({createdAt:-1}).
    limit(5)
    .select("title imageUrl createdAt");

    if (!latestSections.length) {
        return res.json({ banners: [], response: [] });
      }

    const sectionWithTitle=await Promise.all(

         latestSections.map(async(section)=>{

            let titles=await titleModel
            .find({section:section._id})
            .sort({createdAt:-1})
            .select("_id title rating imageUrl createdAt") .lean()
            .exec(); 

          
               titles = titles.map((title) => ({
                ...title,
                rating: title.rating ? parseFloat(title.rating.toString()) : "",
               }));
            
            return{
                type:section.title,
                _id:section._id,
                data:titles
            }

        })
    );

    const banners = latestSections.length ? [{ type: "sections", data: latestSections }] : [];

    res.json({ banners, response: sectionWithTitle });
  
    
}catch(err){
    res.status(500).send({message:err.message});
}

}