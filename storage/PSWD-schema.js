import mongoose from "mongoose"

const PSWDSchema = new mongoose.Schema({
    // // 이름
    name: {
        type: String,
        required: true,
        uinque: true,
    },
    // //기본 데미지
    password: {
        type: String,
        required: true,
    }
})

export default mongoose.model('passwordCk', PSWDSchema);