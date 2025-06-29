const Feature = require("../../models/Feature")




const addFeatureImage = async(req, res)=> {
    try {
        const { image } = req.body;
        

        if(!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required!"
            })
        }
  // extracting url for nested array
        const imageUrl = image[0][0]
       
       

        const featureImages = new Feature({
            image: imageUrl
        })

        await featureImages.save();
        return res.status(201).json({
            success: true,
            data: featureImages
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
            error: error.message
        })
    }
}
const getFeatureImage = async(req, res)=> {
    try {
        const images = await Feature.find({});

        return res.status(200).json({
            success: true,
            data: images
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
            error: error.message
        })
    }
}

const deleteFeatureImage = async(req, res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Id is required!"
            })
        }
       
      const deletedImage = await Feature.findByIdAndDelete(id)

      if (!deletedImage) {
        return res.status(404).json({
            success: false,
            message: "Image not found!"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Image deleted successfully!"
    });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
            error: error.message,
        })
    }
}

module.exports = {
    getFeatureImage,
    addFeatureImage,
    deleteFeatureImage,
}