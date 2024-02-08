import { hashData } from "./userService.js";
import fs from 'fs'
import multiparty from 'multiparty'
hashData("manager123").then(p => console.log(p))

export async function writeBase64ToFile(file, base64String) {
    var bitmap = new Buffer(base64String, 'base64');
    return new Promise((resolve, reject) => {
        fs.writeFile(file, bitmap, (err) => {
            if (err) reject(err); else resolve()
        })
    }
    )
}
export async function getParams(req){
    const form = new multiparty.Form();
    return new Promise((resolve, reject)=>{
        form.parse(req, function(err, fields, files) {
           if(err) reject(err);else resolve({fields, files})
        });
    })
}