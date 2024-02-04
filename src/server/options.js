import fs from 'fs'
export const dbOptions = {
  user: 'gofzadfozcwtpt',
  host: 'ec2-176-34-215-248.eu-west-1.compute.amazonaws.com',
  database: 'd3j3bviak3ovb8',
  password: '52a36d47a25b4b1037172862e96a0d30acaf34c4f334d69d4dcd1300b4ab0ad3',
  port: 5432,
  ssl: { rejectUnauthorized: false }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err); else resolve(data);
    })
  })
}
export async function getCaptions(lang) {
  try {
    const data = await readFile(`./locale/${lang}.json`);
    var result = JSON.parse(data);
  } catch (e) { result = null }
  return result;
}