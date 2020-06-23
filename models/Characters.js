const mongoose = require("mongoose");


// Create Schema
const CharacterSchema = new mongoose.Schema(
    {
        char_name: {
            type: String,
            required: true,
            default: "undefined"
        },
        char_desc: {
            type: String,
            required: true,
            default: "undefined"           
        },
        char_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        },
        isReleased: {
            type: Boolean,
            required: true,
            default: false
        },
        visual_desc: {
            type: String,
            required: true,
            default: "undefined"
        },
        age: {
            type: String,
            required: true,
            default: "0"
        },
        height: {
            type: String,
            required: true,
            default: "0"
        },
        physique: {
            type: String,
            required: true,
            default: "undefined"
        },
        skin_color: {
            type: String,
            required: true,
            default: "undefined"
        },
        weight: {
            type: String,
            required: true,
            default: "0"
        },
        clothing_accessories: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability0: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability0_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability1: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability1_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability2: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability2_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability3: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability3_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability4: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability4_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability5: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability5_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability6: {
            type: String,
            required: true,
            default: "undefined"
        },
        ability6_img_dir: {
            type: String,
            required: true,
            default: "undefined"
        }

    }
)

const Character = mongoose.model('Characters', CharacterSchema)


module.exports = Character;