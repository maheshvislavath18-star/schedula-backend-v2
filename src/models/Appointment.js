const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
{
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },

    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    date:{
        type:String,
        required:true
    },

    startTime:{
        type:String,
        required:true
    },

    endTime:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["BOOKED","CANCELLED"],
        default:"BOOKED"
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);