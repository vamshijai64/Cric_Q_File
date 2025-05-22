const sectionModel = require('../models/sectionModel');
const titleModel = require('../models/titleModel');
const reviewModel= require('../models/reviewModel')

exports.addSection = async (title, imageUrl,images) => {
    const isExists = await sectionModel.findOne({ title });
    if(isExists) throw new Error('Section already exist');

    const newSectionData = new sectionModel({ title, imageUrl,images });
    return await newSectionData.save();
};

exports.getAllSections = async () => {
    const sections = await sectionModel.find().lean().exec();  // Fetch sections

    const sectionsWithTitles = await Promise.all(
        sections.map(async (section) => {
            const titles = await titleModel.find({ section: section._id })
                .select("_id title imageUrl createdAt rating")
                .sort({ createdAt: -1 })
                .lean();

            
            if (!titles || titles.length === 0) {
                section.titles = [];  // Default to empty array
            } else {
                section.titles = titles.map(title => ({
                    ...title,
                    // rating: title.rating ? Number(title.rating.toString()) : 0 // Convert rating safely
                    rating: title.rating ? parseFloat(title.rating.toString()).toFixed(1) : "0.0",
                }));
            }

            return section;
        })
    );

    return sectionsWithTitles;
};


exports.getSectionById = async (sectionId) => {
    const section = await sectionModel.findById(sectionId).lean();
    if (!section) throw new Error("Section not found");

    const titles = await titleModel
        .find({ section: sectionId })
        .select("_id title rating imageUrl createdAt")
        .lean();

    // Ensure rating is always a number (default 0)
    const processedTitles = titles.map(title => ({
        ...title,
        // rating: title.rating ? Number(title.rating.toString()) : 0
        rating: title.rating ? parseFloat(title.rating.toString()).toFixed(1) : "0.0",
    }));

    return { ...section, data: processedTitles };
};
exports.updateSectionById = async (id, data) => {
    // title and imageUrl as data
    const updatedSection = await sectionModel.findByIdAndUpdate(
        id,
        { $set: data }, // only update provided fields
        { new: true }    // return the updated document
    );

    if (!updatedSection) {
        throw new Error("Section not found.");
    }

    return updatedSection;
};

exports.deleteSectionById = async (id) => {
    // Step 1: Find the section
    const section = await sectionModel.findById(id);
    if (!section) {
        throw new Error("Section not found.");
    }

    // Step 2: Get all title IDs under this section
    const titleIds = section.titles;

    // Step 3: Delete all reviews under these titles
    await reviewModel.deleteMany({ title: { $in: titleIds } });

    // Step 4: Delete all titles under this section
    await titleModel.deleteMany({ _id: { $in: titleIds } });

    // Step 5: Delete the section
    await sectionModel.findByIdAndDelete(id);

    return { message: "Section, its titles, and associated reviews deleted successfully." };
};


// const Section = require('../models/sectionModel');
// const Title = require('../models/titleModel');


// exports.getSectionWithTitles = async (sectionId) => {
//     const section = await Section.findById(sectionId);

//     if (!section) {
//         throw new Error("Section not found");
//     }

//     const titles = await Title.find({ sectionId }).sort({ createdAt: -1 });

//     return {
//         _id: section._id,
//         title: section.sectionName,  // Change sectionName -> title
//         imageUrl: section.imageUrl,
//         subcategories: titles.map(title => ({
//             _id: title._id,
//             title: title.title,
//             imageUrl: title.imageUrl,
//             // category: section._id,  // Add sectionId as category
//             rating: title.rating,
//             createdAt: title.createdAt,
//         }))
//         ,
//         createdAt: section.createdAt,
//         updatedAt: section.updatedAt,
//         __v: section.__v
//     }
// }

// exports.getAllSectionsWithTitles = async () => {
//     const sections = await Section.find(); // Fetch all Sections

//     if (!sections || sections.length === 0) {
//         return [];
//     }

//     // Fetch Titles for each Section and attach them
//     const sectionsWithTitles = await Promise.all(
//         sections.map(async (section) => {
//             const titles = await Title.find({ sectionId: section._id });
//             return {
//                 section,
//                 titles
//             };
//         })
//     );

//     return sectionsWithTitles;
// };





// {
//     "section": {
//         "_id": "67cac8730f6c10f462722772",
//         "sectionName": "2024-2025 Movies",
//         "imageUrl": "/uploads/1741342835422-Quiz.jpg",
//         "createdAt": "2025-03-07T10:20:35.488Z",
//         "updatedAt": "2025-03-07T10:20:35.488Z",
//         "__v": 0
//     },
//     "titles": [
//         {
//             "_id": "67cacc7f7fbb315f6d766a2c",
//             "sectionId": "67cac8730f6c10f462722772",
//             "title": "Puspa: The Rule",
//             "imageUrl": "/uploads/1741343871949-Pushpa 2.jpeg",
//             "createdAt": "2025-03-07T10:37:51.968Z",
//             "__v": 0
//         },
//         {
//             "_id": "67cacc277fbb315f6d766a28",
//             "sectionId": "67cac8730f6c10f462722772",
//             "title": "RRR",
//             "imageUrl": "/uploads/1741343783699-RRR-movie-poster-1200x900@gulte.jpeg",
//             "createdAt": "2025-03-07T10:36:23.731Z",
//             "__v": 0
//         }
//     ]
// }
exports.getSectionWithTitles = async (sectionId) => {
    const section = await sectionModel.findById(sectionId);

    if (!section) {
        throw new Error("Section not found");
    }

    const titles = await titleModel.find({ sectionId }).sort({ createdAt: -1 });

    return {
        section,
        titles
    };
};