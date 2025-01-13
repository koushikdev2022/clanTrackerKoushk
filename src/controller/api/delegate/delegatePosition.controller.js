const {Delegate} = require("../../../models")

const {findDelevaryFunction} = require("../../../helper/findDelevaryFunction")
exports.updatePosition = async (req,res) =>{
    try{
        const delegate_id = req?.user?.id
        const lat = req?.body?.lat
        const long = req?.body?.long

        const delegateDetails = await Delegate.findByPk(delegate_id)
        const update= delegateDetails.update({
            latitude:lat,
            longitude:long
        })
        if(update){
              res.status(200).json({
                    status:true,
                    status_code:200,
                    message:"update successfully"
              })
        }else{
            res.status(400).json({
                status:false,
                status_code:400,
                message:"not updated still now"
          })
        }
    }catch (error) {
        console.error("Error in get send:", error);
        const status = error?.status || 400;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({
            message,
            status: false,
            status_code: status,
        });
    }
        

        
}


exports.data = async (req,res) =>{
        const data = findDelevaryFunction()
}